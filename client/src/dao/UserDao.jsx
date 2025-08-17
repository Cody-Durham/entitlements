import PropTypes from "prop-types";

import ServiceWrapper from "../utils/ServiceWrapper";
import {
    USER_ACTIVE_SCHOOL_YEAR,
    USER_GET_USERS_BY_ROLE,
    USER_LOCATION,
    USER_LOCATION_SEARCHABLE_GET,
    USER_SERVICE
} from "../const/UserConst";

/**
 * Data Access for the User API
 * @name UserDao
 * @param props
 * @return {null|*}
 */
const UserDao = (props) => {
    const { action, locKey, params, role, token, username } = props;
    const bearer = `Bearer ${token}`;
    // @TODO: add "Access-Control-Max-Age" as an allowed header on the User Service
    const options = {
        headers: {
            Authorization: bearer
        }
    };
    switch (action) {
        case "activeSchoolYearRead":
            options.method = "GET";
            options.url = USER_ACTIVE_SCHOOL_YEAR;
            break;
        case "locationsSearchableRead":
            options.method = "GET";
            if (params) {
                options.params = params;
            }
            options.url = USER_LOCATION_SEARCHABLE_GET;
            break;
        case "userDetailsRead":
            options.method = "GET";
            options.url = `${USER_SERVICE}/${username}/details.json`;
            break;
        case "userLocationRead":
            options.method = "GET";
            options.url = `${USER_LOCATION}/${locKey}/index.json`;
            break;
        case "useGetUsersByRole":
            options.method = "GET";
            options.url = `${USER_GET_USERS_BY_ROLE}/ASSESSMENT_EXCUSAL/${role}/index.json`;
            break;
        default:
            return null;
    }

    return ServiceWrapper.serviceCall({
        options,
        ...props
    });
};

UserDao.propTypes = {
    action: PropTypes.string.isRequired,
    locKey: PropTypes.string,
    params: PropTypes.oneOfType([PropTypes.object]),
    role: PropTypes.string,
    token: PropTypes.string.isRequired,
    username: PropTypes.string
};

UserDao.defaultProps = {
    locKey: null,
    params: null,
    role: "",
    username: null
};

export default UserDao;
