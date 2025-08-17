import PropTypes from "prop-types";

import ServiceWrapper from "../utils/ServiceWrapper";

/**
 * Data Access for the JWT API
 * @name JwtDao
 * @param props
 * @return {null|*}
 */
const JwtDao = (props) => {
    const { action, params, token, username } = props;
    // Does this require port 443?
    const JWT_SERVICE = "/token/v0";
    const PUBLIC_TOKEN = "/public-token/v1/public/asUser";
    const bearer = `Bearer ${token}`;
    const options = {
        headers: {
            Authorization: bearer
        }
    };
    switch (action) {
        case "publicTokenRead":
            options.method = "GET";
            options.params = params;
            options.url = `${PUBLIC_TOKEN}/${username}/token`;
            break;
        case "tokenForUserRead":
            options.method = "GET";
            options.url = `${JWT_SERVICE}/forUser/${username}/generate.json`;
            break;
        case "tokenRead":
            options.method = "GET";
            options.url = `${JWT_SERVICE}/generate.json`;
            break;
        case "tokenUsernameRead":
            options.method = "GET";
            options.url = `${JWT_SERVICE}/${username}/generate.json`;
            break;
        default:
            return null;
    }

    return ServiceWrapper.serviceCall({
        options,
        ...props
    });
};

JwtDao.propTypes = {
    action: PropTypes.string.isRequired,
    params: PropTypes.oneOfType([PropTypes.object]),
    token: PropTypes.string.isRequired,
    username: PropTypes.string
};

JwtDao.defaultProps = {
    params: null,
    username: null
};

export default JwtDao;
