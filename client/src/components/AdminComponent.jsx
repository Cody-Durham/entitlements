import PropTypes from "prop-types";

import ActionButton from "./formInputs/buttons/ActionButton";
import Icon from "./icon/Icon";

import "../styles/AdminComponent.scss";

const AdminComponent = ({ handleRouting, header, icon, message1, name }) => {
    return (
        <div className="overall-container gutter-95">
            <div className="left-side">
                <div className="logo-container">
                    <Icon fill="#46A8B0" height={30} iconName={icon} width={30} />
                </div>
                <div className="header-button-container">
                    <div className="logo-header">{header}</div>
                    <div>
                        <ActionButton
                            className="action-button-admin"
                            label="OPEN"
                            name={name}
                            onClick={handleRouting}
                        />
                    </div>
                </div>
            </div>
            <div className="right-container">
                <ul>
                    <li>{message1}</li>
                </ul>
            </div>
        </div>
    );
};

AdminComponent.propTypes = {
    handleRouting: PropTypes.func,
    header: PropTypes.string,
    icon: PropTypes.string,
    message1: PropTypes.string,
    name: PropTypes.string
};

AdminComponent.defaultProps = {
    header: "",
    icon: "",
    message1: "",
    name: ""
};

export default AdminComponent;
