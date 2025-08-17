import { Link } from "react-router-dom";
import PropTypes, { oneOfType } from "prop-types";

import ActionButton from "../formInputs/buttons/ActionButton";
import DcsdDialog from "./DcsdDialog";

import { EMPLOYEE_DASHBOARD } from "../../utils/auth/config";

const WindowAndPermissionDialog = ({ buttonText, id, open, sorryMessage, sorryTitle }) => {
    const getBackToDialogActions = () => {
        if (buttonText && buttonText.length > 0) {
            return (
                <Link to="/admin/home">
                    <ActionButton
                        ariaLabel="Back to DCSD Home"
                        className="action-button-reg"
                        label={buttonText}
                    ></ActionButton>
                </Link>
            );
        } else {
            return (
                <ActionButton
                    ariaLabel="Back to Employee Dashboard"
                    className="action-button-reg"
                    label="Back to Dashboard"
                    onClick={() => {
                        window.location.replace(EMPLOYEE_DASHBOARD);
                    }}
                />
            );
        }
    };

    return (
        <DcsdDialog actions={getBackToDialogActions()} hasCloseX={false} id={id} open={open} title={sorryTitle}>
            {sorryMessage}
        </DcsdDialog>
    );
};

WindowAndPermissionDialog.propTypes = {
    id: PropTypes.string,
    open: PropTypes.string,
    buttonText: PropTypes.string,
    sorryMessage: oneOfType([PropTypes.object, PropTypes.string]),
    sorryTitle: PropTypes.string
};

export default WindowAndPermissionDialog;
