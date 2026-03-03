import {
    createContext,
    useState,
    useEffect,
    useCallback,
    useRef,
    useContext,
} from "react";
import { client } from "../helpers/axiosClient";

const AuthContext = createContext();

const isTokenExpired = (token) => {
    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        return payload.exp * 1000 < Date.now();
    } catch {
        return true;
    }
};

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const userRef = useRef(user);

    useEffect(() => {
        userRef.current = user;
    }, [user]);

    const login = useCallback((tokenData, userData) => {
        setUser(userData);
        setToken(tokenData);
        localStorage.setItem("token", tokenData);
        localStorage.setItem("user", JSON.stringify(userData));
    }, []);

    const logout = useCallback(() => {
        if (userRef.current?.id) {
            localStorage.removeItem(`activeSession_${userRef.current.id}`);
        }
        setUser(null);
        setToken(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
    }, []);

    useEffect(() => {
        const storedToken = localStorage.getItem("token");

        if (!storedToken || isTokenExpired(storedToken)) {
            if (storedToken) logout();
            setLoading(false);
            return;
        }

        try {
            const storedUser = JSON.parse(localStorage.getItem("user"));
            setUser(storedUser);
            setToken(storedToken);
        } catch {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
        } finally {
            setLoading(false);
        }
    }, []);

    const handleOAuthCallback = useCallback(
        async (token) => {
            try {
                const { data } = await client.get("/u/profile", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                login(token, data);
            } catch (error) {
                console.error("OAuth callback error:", error);
                throw error;
            }
        },
        [login],
    );

    return (
        <AuthContext.Provider
            value={{ user, token, login, logout, loading, handleOAuthCallback }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
export { AuthProvider };
