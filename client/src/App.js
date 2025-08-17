import { Route, Routes } from "react-router-dom";

import AdminHome from "./segments/AdminHome";
import CreateAndEdit from "./segments/CreateAndEdit";
import LoadTestHome from "./components/LoadTestHome";
import Login from "./components/Login";
import ManageEntitlements from "./segments/ManageEntitlements";
import NotFound from "./components/NotFound";
import PrivateRoute from "./components/privateRoute/PrivateRoute";
import Reprocess from "./segments/Reprocess";

/**
 * Routing for the DUO Bypass Login
 * @name App
 * @return {{}}
 */
const App = () => {
    return (
        <Routes>
            <Route path="/" element={<PrivateRoute />}>
                <Route path="/" element={<AdminHome />} />
            </Route>

            {/* Admin */}
            <Route path="/home" element={<PrivateRoute />}>
                <Route path="/home" element={<AdminHome />} />
            </Route>
            <Route path="/manage" element={<PrivateRoute />}>
                <Route path="/manage" element={<ManageEntitlements />} />
                <Route path="/manage/:action" element={<CreateAndEdit />} />
                <Route path="/manage/:action/:id" element={<CreateAndEdit />} />
            </Route>
            <Route path="/reprocess" element={<PrivateRoute />}>
                <Route path="/reprocess" element={<Reprocess />} />
            </Route>
            <Route path="/notFound" element={<NotFound />} />
            <Route default element={<NotFound />} />
            <Route path="*" element={<NotFound />} />
            {/* Development ONLY */}
            {process.env.NODE_ENV !== "production" && (
                <>
                    <Route path="/backdoor" exact element={<Login />} />
                    <Route path="/loadtest" exact element={<NotFound />} />
                    <Route path="/loadtest/:userName" element={<PrivateRoute />}>
                        <Route path="/loadtest/:userName" element={<LoadTestHome />} />
                    </Route>
                </>
            )}
        </Routes>
    );
};

export default App;
