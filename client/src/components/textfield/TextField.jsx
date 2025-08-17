import PropTypes from "prop-types";

/**
 * Display a textarea input with a character count
 * @name TextField
 * @param {string} className,
 * @param {string} charsUsed,
 * @param {string} maxLimit,
 * @param {string} name,
 * @param {func} onChange,
 * @param {string} value
 * @return {JSX.element}
 * @constructor
 */
const TextField = ({
    className,
    charsUsed,
    disabled,
    id,
    label,
    maxLimit,
    name,
    onBlur,
    onChange,
    placeholder,
    value
}) => {
    const spacesLeft = maxLimit - charsUsed;
    const disabledColor = disabled ? "#DEDEDE" : "";

    return (
        <div>
            <div className="text-group">
                {label && label.length && (
                    <label className="input-heading" htmlFor={id || name}>
                        {label}
                    </label>
                )}
                <textarea
                    className={className}
                    disabled={disabled}
                    id={id}
                    maxLength={maxLimit}
                    name={name}
                    onBlur={onBlur}
                    onChange={onChange}
                    placeholder={placeholder}
                    style={{ backgroundColor: disabledColor }}
                    value={value}
                />
                <div className="spaces-left">{`${spacesLeft} characters left`}</div>
            </div>
        </div>
    );
};

TextField.propTypes = {
    className: PropTypes.string,
    charsUsed: PropTypes.number,
    disabled: PropTypes.bool,
    id: PropTypes.string,
    label: PropTypes.string,
    maxLimit: PropTypes.number,
    name: PropTypes.string,
    onBlur: PropTypes.func,
    onChange: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
    value: PropTypes.string
};

TextField.defaultProps = {
    className: "text-textarea",
    charsUsed: "",
    disabled: false,
    id: "",
    label: null,
    maxLimit: "",
    name: "",
    onBlur: null,
    placeholder: "Enter Comments Here",
    value: ""
};

export default TextField;
