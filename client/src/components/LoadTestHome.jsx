import { useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { GlobalContext } from "./contextProvider/ContextProvider";

/**
 * IMPORTANT - This is for Testing only - this component will only load when NODE_ENV !== "production"
 * Take a username and student number to store in Context and redirect to the Fischer Entitlements  page
 * @name LoadTest
 * @constructor
 * @return {JSX.Element}
 */
const LoadTestHome = () => {
    const { userName } = useParams();

    const navigate = useNavigate();

    const { dispatch, state } = useContext(GlobalContext);
    const { username } = state || {};

    /**
     * set username in context
     */
    useEffect(() => {
        if (userName && !username) {
            dispatch({
                type: "Username",
                username: userName
            });
            sessionStorage.setItem("uname", userName);
        }
    }, [dispatch, userName, username]);

    /**
     * Navigates to the Fischer Entitlements ADMIN home page
     */
    useEffect(() => {
        if (username) {
            navigate("/home");
        }
    }, [navigate, username]);

    return (
        <div>
            <h2>Welcome to the Load Tester - setting values for Fischer Entitlements</h2>
        </div>
    );
};

export default LoadTestHome;
