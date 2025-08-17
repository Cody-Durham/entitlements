import PropTypes from "prop-types";

import ServiceWrapper from "../utils/ServiceWrapper";

import {
    AD_AVAILABLE_GROUPS_READ,
    ALL_JOB_PROFILES_READ,
    ALL_LOCATIONS_READ,
    CREATE_FISCHER_ENTITLEMENTS,
    FISCHER_ENTITLEMENT_BY_ID,
    GOOGLE_AVAILABLE_GROUPS_READ,
    IC_AVAILABLE_GROUPS_READ,
    IC_FLAGS_GROUPS_READ,
    LIST_OF_ENTITLEMENTS_BY_JOB_PROFILE,
    LIST_OF_JOBS_MISSING_ENTITLEMENTS,
    REPROCESS_READ,
    REPROCESS_SUBMIT
} from "../const/EntitlementsConst";

/**
 * Data Access for the Fischer Entitlements
 * @name EntitlementsDao
 * @param props
 * @return {null|*}
 */
const EntitlementsDao = (props) => {
    const { action, data, key, params, token, userType } = props;
    const bearer = `Bearer ${token}`;
    const options = {
        headers: {
            Authorization: bearer
        }
    };
    switch (action) {
        case "adAvailableGroupsRead":
            options.method = "GET";
            options.url = AD_AVAILABLE_GROUPS_READ;
            break;
        case "allJobProfilesRead":
            options.method = "GET";
            options.url = `${ALL_JOB_PROFILES_READ}/index.json`;
            break;
        case "allLocationsRead":
            options.method = "GET";
            options.url = ALL_LOCATIONS_READ;
            break;
        case "entitlementsUpdatePut":
            options.data = data;
            options.method = "PUT";
            options.url = `${FISCHER_ENTITLEMENT_BY_ID}/${key}/detail.json`;
            break;
        case "entitlementsUpdatePost":
            options.data = data;
            options.method = "POST";
            options.url = CREATE_FISCHER_ENTITLEMENTS;
            break;
        case "googleAvailableGroupsRead":
            options.method = "GET";
            options.url = GOOGLE_AVAILABLE_GROUPS_READ;
            break;
        case "icAvailableGroupsRead":
            options.method = "GET";
            options.url = IC_AVAILABLE_GROUPS_READ;
            break;
        case "icFlagsGroupsRead":
            options.method = "GET";
            options.url = IC_FLAGS_GROUPS_READ;
            break;
        case "listOfEntitlementsByJobProfileRead":
            options.method = "GET";
            options.url = LIST_OF_ENTITLEMENTS_BY_JOB_PROFILE;
            if (params) {
                options.params = params;
            }
            break;
        case "listOfJobsMissingEntitlementsRead":
            options.method = "GET";
            options.url = LIST_OF_JOBS_MISSING_ENTITLEMENTS;
            break;
        case "reprocessRead":
            options.method = "GET";
            if (params) {
                options.params = params;
            }
            options.url = `${REPROCESS_READ}/${userType}/index.json`;
            break;
        case "reprocessSubmit":
            options.data = data;
            options.method = "PUT";
            options.url = `${REPROCESS_SUBMIT}/${userType}/update`;
            break;
        case "selectedOptionsById":
            options.method = "GET";
            options.url = `${FISCHER_ENTITLEMENT_BY_ID}/${key}/details.json`;
            break;
        default:
            return null;
    }

    return ServiceWrapper.serviceCall({
        options,
        ...props
    });
};

EntitlementsDao.propTypes = {
    action: PropTypes.string.isRequired,
    data: PropTypes.objectOf([PropTypes.object]),
    key: PropTypes.string,
    params: PropTypes.oneOfType([PropTypes.object]),
    token: PropTypes.string.isRequired,
    userType: PropTypes.string
};

EntitlementsDao.defaultProps = {
    data: null,
    key: "",
    params: null,
    userType: null
};

export default EntitlementsDao;
