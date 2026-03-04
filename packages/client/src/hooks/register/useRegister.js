import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { client } from "../helpers/axiosClient";

export default function useRegister() {
    const { login } = useAuth();
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();

    const registerUser = async (form) => {
        try {
            setSubmitting(true);
            const response = await client.post("/auth/register", form);

            const userData = response.data;
            login(userData.token, userData.user);
            navigate("/posts");
            return userData;
        } catch (err) {
            const errors = err.response.data.errors;
            setError(errors);
            setSubmitting(false);
        } finally {
            setSubmitting(false);
        }
    };
    return { registerUser, error, submitting };
}
