import { BrowserRouter, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import AppRoutes from "./Routes";
import "./styles/app.css";
import { useAuth } from "./context/AuthContext";
import { setupInterceptors } from "./helpers/axiosClient";

const App = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        setupInterceptors(logout, navigate);
    }, [logout, navigate]);

    return (
        <BrowserRouter>
            <div className="app">
                <div className="main">
                    <AppRoutes />
                </div>
            </div>
        </BrowserRouter>
    );
};

export default App;
