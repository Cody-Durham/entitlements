import PropTypes from "prop-types";

import Form from "react-bootstrap/Form";

import "../styles/ToggleSwitch.scss";

const ToggleSwitch = ({ handleChange, label }) => {
    return (
        <Form>
            <div className="switch-container">
                <div className="switch">
                    <label className="sr-only" htmlFor="custom-switch">
                        {label}
                    </label>
                    <Form.Check // prettier-ignore
                        onChange={handleChange}
                        type="switch"
                        id="custom-switch"
                    />
                </div>
                <div className="switch-label">{label}</div>
            </div>
        </Form>
    );
};

ToggleSwitch.propTypes = {
    handleChange: PropTypes.func.isRequired,
    label: PropTypes.string.isRequired
};

export default ToggleSwitch;
