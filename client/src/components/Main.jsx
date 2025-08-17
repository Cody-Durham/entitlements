import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import RbA from "./rba/RbA.jsx";

/**
 * Fischer Entitlements main
 * @name Main
 * @return {JSX.Element}
 * @constructor
 */
const Main = () => {
    const navigate = useNavigate();
    const allowedRolesArray = ["FISCHER_ADMIN"];

    useEffect(() => {
        const path = sessionStorage.getItem("orig-path");
        navigate(path);
    }, [navigate]);

    return <RbA allowedRoles={allowedRolesArray} redirect="/notFound" />;
};

export default Main;
