import PropTypes from "prop-types";

import ActionButton from "./formInputs/buttons/ActionButton";
import Icon from "./icon/Icon";

import "../styles/Toolbar.scss";

const Toolbar = ({ showBackButton }) => {
    return (
        <div className="toolbar-container">
            <div className="title-container">
                <div className="logo-container icon">
                    <Icon fill="#0669B3" height={65} iconName="FISCHER_ENTITLEMENTS_LOGO" width={65} />
                </div>
                <div className="text-container">
                    <div className="logo-text1">FISCHER</div>
                    <div className="logo-text2">ENTITLEMENTS</div>
                </div>
            </div>
            <div>
                {showBackButton && (
                    <a href="/home" rel="noreferrer">
                        <ActionButton className="back-to-admin-home" label="Manager Home Page" />
                    </a>
                )}
            </div>
        </div>
    );
};

export default Toolbar;

Toolbar.propTypes = {
    label: PropTypes.string,
    showBackButton: PropTypes.bool
};

Toolbar.defaultProps = {
    label: "",
    showBackButton: false
};
