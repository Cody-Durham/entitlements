import PropTypes from "prop-types";

import "../../../styles/TranslationButton.scss";

/**
 * A button for performing various actions (submit, open, close, cancel, etc)
 * @name TranslationButton
 * @param className
 * @param id
 * @param label
 * @param onClick
 * @return {JSX.Element}
 * @constructor
 */
const TranslationButton = ({ className, id, label, onClick }) => {
    return (
        <button className={className} id={id} onClick={onClick} tabIndex={0} type="button">
            {label}
        </button>
    );
};

TranslationButton.propTypes = {
    className: PropTypes.string,
    onClick: PropTypes.func,
    id: PropTypes.string,
    label: PropTypes.string
};

TranslationButton.defaultProps = {
    className: "translation-button",
    onClick: null,
    id: "",
    label: ""
};

export default TranslationButton;
