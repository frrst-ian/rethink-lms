import { useState } from "react";
import { client } from "../../helpers/axiosClient";

export default function useCreateMaterial(courseId, onSuccess) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const createMaterial = async (title, category, file) => {
        try {
            setLoading(true);
            setError(null);

            const formData = new FormData();
            formData.append("title", title);
            if (category) formData.append("category", category);
            if (file) formData.append("file", file);

            const { data } = await client.post(
                `/courses/${courseId}/materials`,
                formData,
                { headers: { "Content-Type": "multipart/form-data" } },
            );
            onSuccess(data);
        } catch (err) {
            setError(err.response?.data?.errors?.[0] || "Failed to upload material.");
        } finally {
            setLoading(false);
        }
    };

    return { createMaterial, loading, error };
}