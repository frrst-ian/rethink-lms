import { BrowserRouter, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import AppRoutes from "./Routes";
import "./styles/app.css";
import { useAuth } from "./context/AuthContext";
import { setupInterceptors } from "./helpers/axiosClient";

function InterceptorSetup() {
    const { logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        setupInterceptors(logout, navigate);
    }, [logout, navigate]);

    return null;
}

const App = () => {
    return (
        <BrowserRouter>
            <div className="app">
                <div className="main">
                    <InterceptorSetup />

                    <AppRoutes />
                </div>
            </div>
        </BrowserRouter>
    );
};

export default App;
