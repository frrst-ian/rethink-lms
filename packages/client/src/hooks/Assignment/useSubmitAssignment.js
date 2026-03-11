import { useState } from "react";
import { useParams } from "react-router-dom";
import { client } from "../../helpers/axiosClient";

export default function useSubmitAssignment() {
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const { assignmentId } = useParams();

    const submit = async ({ content, file }) => {
        try {
            setSubmitting(true);
            setError(null);

            const formData = new FormData();
            if (content) formData.append("content", content);
            if (file) formData.append("file", file);

            const { data } = await client.post(
                `/assignments/${assignmentId}/submissions`,
                formData,
                { headers: { "Content-Type": "multipart/form-data" } },
            );

            setResult(data);
            return data;
        } catch (err) {
            const msg =
                err.response?.data?.errors?.[0] || "Submission failed.";
            setError(msg);
            return null;
        } finally {
            setSubmitting(false);
        }
    };

    return { submit, result, error, submitting };
}