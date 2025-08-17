import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import AdminComponent from "../components/AdminComponent.jsx";
import AdminHeader from "../components/header/AdminHeader.jsx";
import RbA from "../components/rba/RbA.jsx";
import Toolbar from "../components/Toolbar.jsx";

import { GlobalContext } from "../components/contextProvider/ContextProvider.jsx";

import "react-toastify/dist/ReactToastify.css";
import "../styles/global/Global.scss";

/**
 * @name AdminHome
 * @returns {JSX.Element}
 */
const AdminHome = () => {
    const { state } = useContext(GlobalContext);
    const { userDetails } = state;

    const navigate = useNavigate();

    const allowedRolesArray = ["FISCHER_ADMIN"];

    /**
     * @name handleRouting
     * @returns
     */
    const handleRouting = (e) => {
        const { name } = e.target;
        if (name === "entitlements") {
            navigate("/manage");
        }
        if (name === "reprocess") {
            navigate("/reprocess");
        }
    };
    return (
        <RbA allowedRoles={allowedRolesArray} redirect="/notFound">
            <AdminHeader />
            <ToastContainer style={{ width: "50%" }} />
            <div className="gutter-95">
                <Toolbar label="Fischer Entitlements" />
                <AdminComponent
                    handleRouting={handleRouting}
                    header="Manage Entitlements"
                    icon="HAMBURGER"
                    message1="Edit/Create New Entitlements"
                    name="entitlements"
                    userDetails={userDetails}
                />
                <AdminComponent
                    handleRouting={handleRouting}
                    header="Reprocess Users"
                    icon="HAMBURGER"
                    message1="Reprocess Employees, Guardians, and Students"
                    name="reprocess"
                    userDetails={userDetails}
                />
                <hr />
            </div>
        </RbA>
    );
};

export default AdminHome;
