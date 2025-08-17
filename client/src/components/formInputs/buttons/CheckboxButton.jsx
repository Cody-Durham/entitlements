import PropTypes from "prop-types";

import "../../../styles/CheckboxButton.scss";

/**
 * A Button that looks and acts like a checkbox
 * @name CheckboxButton
 * @param {func} handleClick
 * @param {string} id
 * @param {bool} isChecked
 * @param {bool} isDisabled
 * @param {string|null} label
 * @param {string} name
 * @param {string} value
 * @return {JSX.Element}
 * @constructor
 */
const CheckboxButton = ({ handleChange, id, isChecked, isDisabled, label, name, value }) => {
    const checkClass = isChecked ? " checked" : "";

    return (
        <div className={`checkbox-small-button${checkClass}`}>
            <label htmlFor={id}>
                <input
                    id={id}
                    checked={isChecked}
                    disabled={isDisabled}
                    name={name}
                    onChange={() => {
                        handleChange();
                    }}
                    tabIndex={0}
                    type="checkbox"
                    value={value}
                />
                {label}
            </label>
        </div>
    );
};

CheckboxButton.propTypes = {
    handleChange: PropTypes.func.isRequired,
    id: PropTypes.string,
    isChecked: PropTypes.bool,
    isDisabled: PropTypes.bool,
    label: PropTypes.string,
    name: PropTypes.string,
    value: PropTypes.string
};

CheckboxButton.defaultProps = {
    id: "",
    isChecked: false,
    isDisabled: false,
    label: "",
    name: "",
    value: ""
};

export default CheckboxButton;
