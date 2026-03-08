import { useState } from "react";
import { client } from "../../helpers/axiosClient";

export default function useCreateCourse(onSuccess) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const createCourse = async (title, section) => {
        try {
            setLoading(true);
            setError(null);
            const { data } = await client.post("/courses", { title, section });
            onSuccess(data);
        } catch (err) {
            setError(err.response?.data?.error || "Failed to create course.");
        } finally {
            setLoading(false);
        }
    };

    return { createCourse, loading, error };
}