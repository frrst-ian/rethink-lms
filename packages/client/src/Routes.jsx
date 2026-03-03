import { Routes, Route, Navigate } from "react-router-dom";
// import Register from "./components/Register/Register";
import Login from "./pages/Login/Login";
// import OAuthCallback from "./components/OAuthCallback/OAuthCallback";
// import NotFound from "./components/Utils/NotFound";

const AppRoutes = () => {
    return (
        <Routes>
            {/*<Route path="*" element={<NotFound />} />*/}
            <Route path="/" element={<Navigate to="login" replace />} />
            {/*<Route path="register" element={<Register  />} />*/}
            <Route path="login" element={<Login />} />
            {/*<Route path="auth/callback" element={<OAuthCallback />} />*/}

           
        </Routes>
    );
};

export default AppRoutes;