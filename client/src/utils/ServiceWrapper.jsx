import axios from "axios";

import { SERVICE_HOST } from "./auth/config";

/**
 * Uses axios - method, url, event listeners, etc. are passed into the options
 * param as an object.
 * @name ServiceWrapper
 * @param {{}} options
 * @return {Promise}
 */
const axiosInstance = axios.create({
    baseURL: SERVICE_HOST,
    timeout: 30000,
    headers: { "Content-Type": "application/json", "Access-Control-Max-Age": 86400 },
    withCredentials: true
});

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const config = error.config;

        // Add a custom retry count if it doesn't exist
        if (!config.__retryCount) {
            config.__retryCount = 0;
        }

        // Max number of retries
        const MAX_RETRIES = 2;

        if (error.response && error.response.status >= 500 && config.__retryCount < MAX_RETRIES) {
            config.__retryCount += 1;

            // Optional: wait before retrying (simple backoff)
            await ServiceWrapper.wait(500 * config.__retryCount);

            // Retry the request
            return axiosInstance(config);
        }

        // Otherwise, reject the promise
        return Promise.reject(error);
    }
);

const pendingRequests = new Map();
const ServiceWrapper = (options) => axiosInstance(options);

/**
 * Do we have a workable status? If not, throw an error with the status text
 * @name checkStatus
 * @static
 * @param {{}} response
 * @return {{}} response
 * @throws {Error} error
 */
ServiceWrapper.checkStatus = (response) => {
    // Success status is any 200s response
    if (response.status >= 200 && response.status < 300) {
        return response;
    }
    throw new Error(response);
};

// Helper wait function
ServiceWrapper.wait = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Detect the type of error and return the appropriate message
 * @name errorHandler
 * @static
 * @param {{}|string|null} error
 * @return {string|*}
 */
ServiceWrapper.errorHandler = (error) => {
    if (error.response) {
        const { status, data } = error.response;

        return `${status}: ${typeof data === "string" ? data : JSON.stringify(data)}`;
    }
    if (error.request) {
        return "No response received from server";
    }
    if (error.message) {
        return error.message;
    }

    return "Unknown error";
};

/**
 * Convert response headers into an array
 * @name responseHeadersAsArray
 * @static
 * @param {{}} response
 * @return {[]} headers
 */
ServiceWrapper.responseHeadersAsArray = (response) => ({ ...response.headers });

/**
 * Perform CRUD operations with an API
 * @name serviceCall
 * @static
 * @param {{}} options
 * @return {*}
 */
ServiceWrapper.serviceCall = async ({ options }) => {
    try {
        const key = JSON.stringify(options);
        if (pendingRequests.has(key)) {
            return pendingRequests.get(key);
        }

        const promise = ServiceWrapper(options).finally(() => pendingRequests.delete(key));

        pendingRequests.set(key, promise);

        return promise;
    } catch (error) {
        throw new Error(ServiceWrapper.errorHandler(error));
    }
};

export default ServiceWrapper;
