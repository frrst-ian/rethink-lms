import { useAuth } from "../../context/AuthContext";
import { Navigate } from "react-router-dom";

const isTokenExpired = (token) => {
    try {
        const { exp } = JSON.parse(atob(token.split(".")[1]));
        return exp * 1000 < Date.now();
    } catch {
        return true;
    }
};

const ProtectedRoute = ({ children }) => {
    const { user, loading, logout } = useAuth();
    if (loading) return <div className="loading">Loading...</div>;
    if (!user) return <Navigate to="/login" replace />;

    const token = localStorage.getItem("token");
    if (!token || isTokenExpired(token)) {
        logout();
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;