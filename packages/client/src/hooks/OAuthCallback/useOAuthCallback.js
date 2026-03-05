import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const useOAuthCallback = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { handleOAuthCallback } = useAuth();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const token = params.get("token");

        if (!token) return navigate("/login");

        try {
            const needsOnboarding = handleOAuthCallback(token);
            needsOnboarding ? navigate("/onboard") : navigate("/dashboard");
        } catch {
            navigate("/login");
        }
    }, [location, navigate, handleOAuthCallback]);
};

export default useOAuthCallback;
