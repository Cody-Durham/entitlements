import PropTypes from "prop-types";

import "../../styles/BreadCrumb.scss";

/**
 * @name BreadCrumb
 * @return {JSX.Element}
 */
const BreadCrumb = ({ label }) => {
    return (
        <div className="crumb-container">
            <div className="bc-location">
                <h6>{label}</h6>
            </div>
        </div>
    );
};

BreadCrumb.propTypes = {
    label: PropTypes.string
};

BreadCrumb.defaultProps = {
    label: ""
};

export default BreadCrumb;
