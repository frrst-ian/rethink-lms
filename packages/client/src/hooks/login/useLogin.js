import { useContext, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { client } from "../../helpers/axiosClient";

export default function useLogin() {
    const { login } = useAuth();
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const [submitting, setSubmitting] = useState(false);

    const loginUser = async (email, password) => {
        try {
            setSubmitting(true);

            const response = await client.post("/auth/login", {
                email: email,
                password: password,
            });

            const userData = await response.data;
            login(userData.token, userData.user);
            navigate("/dashboard");
        } catch (err) {
            console.log("res:", err.response.data)
            setError(err.response.data.errors);
        } finally {
            setSubmitting(false);
        }
    };

    return { loginUser, error, submitting };
}