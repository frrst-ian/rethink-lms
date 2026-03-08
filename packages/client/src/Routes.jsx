import { Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/Register/Register";
import Login from "./pages/Login/Login";
import OAuthCallback from "./pages/OAuthCallback/OAuthCallback";
import NotFound from "./components/NotFound/NotFound";
import Onboard from "./pages/Onboard/Onboard";
import Courses from "./pages/Courses/Courses";
import ProtectedRoute from "./components/Utils/ProtectedRoutes";

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="*" element={<NotFound />} />

            <Route path="/" element={<Navigate to="login" replace />} />

            <Route path="register" element={<Register />} />

            <Route path="login" element={<Login />} />

            <Route path="/onboard" element={<Onboard />} />

            <Route path="/auth/callback" element={<OAuthCallback />} />

            <Route
                path="dashboard"
                element={
                    <ProtectedRoute>
                        <Courses />
                    </ProtectedRoute>
                }
            />
             <Route
                path="courses"
                element={
                    <ProtectedRoute>
                        <Courses />
                    </ProtectedRoute>
                }
            />
        </Routes>
    );
};

export default AppRoutes;
