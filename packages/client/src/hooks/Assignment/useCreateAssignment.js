import { useState } from "react";
import { useParams } from "react-router-dom";
import { client } from "../../helpers/axiosClient";

export default function useCreateAssignment(onSuccess) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { id: courseId } = useParams();

    const createAssignment = async (title, description, dueDate, file) => {
        try {
            setLoading(true);
            setError(null);

            const formData = new FormData();
            formData.append("title", title);
            formData.append("description", description);
            formData.append("dueDate", new Date(dueDate).toISOString());
            if (file) formData.append("file", file);

            const { data } = await client.post(
                `/courses/${courseId}/assignments`,
                formData,
                { headers: { "Content-Type": "multipart/form-data" } },
            );
            onSuccess(data);
        } catch (err) {
            setError(err.response?.data?.errors?.[0] || "Failed to create assignment.");
        } finally {
            setLoading(false);
        }
    };

    return { createAssignment, loading, error };
}