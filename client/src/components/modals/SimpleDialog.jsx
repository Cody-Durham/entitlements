import PropTypes from "prop-types";

import "../../styles/SimpleDialog.scss";

const SimpleDialog = ({ children, message1, message2, message3 }) => {
    return (
        <div className="dialogue-container">
            <div className="dialogue-message-container">
                <div className="dialogue-message1">{message1}</div>
                {children}
                <div className="dialogue-message2">{message2}</div>
                <div className="dialogue-message2">{message3}</div>
            </div>
        </div>
    );
};

export default SimpleDialog;

SimpleDialog.propTypes = {
    children: PropTypes.node,
    message1: PropTypes.string,
    message2: PropTypes.string,
    message3: PropTypes.string
};

SimpleDialog.defaultProps = {
    children: null,
    message1: "",
    message2: "",
    message3: ""
};
