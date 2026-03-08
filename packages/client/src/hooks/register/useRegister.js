import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { client } from "../../helpers/axiosClient";

export default function useRegister() {
    const { login } = useAuth();
    const [errors, setErrors] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();

    const registerUser = async (
        name,
        email,
        password,
        confirmPassword,
        role,
    ) => {
        try {
            setErrors([]);
            setSubmitting(true);
            const response = await client.post("/auth/register", {
                name,
                email,
                password,
                confirmPassword,
                role,
            });

            const userData = response.data;
            login(userData.token, userData.user);
            navigate("/dashboard");
            return userData;
        } catch (err) {
            const errorMessages = err.response?.data?.errors || [
                "An unexpected error occurred",
            ];
            setErrors(errorMessages);
        } finally {
            setSubmitting(false);
        }
    };
    return { registerUser, errors, submitting };
}
