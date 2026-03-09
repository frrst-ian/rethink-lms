import axios from "axios";

export const client = axios.create({
    baseURL: "http://localhost:3000/api",
});

client.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export function setupInterceptors(logout, navigate) {
    client.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response?.status === 401) {
                logout();
                navigate("/login");
            }
            return Promise.reject(error);
        }
    );
}