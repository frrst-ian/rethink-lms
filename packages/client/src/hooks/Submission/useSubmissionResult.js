import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { client } from "../../helpers/axiosClient";

export default function useSubmissionResult() {
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { id } = useParams();

    useEffect(() => {
        const fetch = async () => {
            try {
                const { data } = await client.get(`/assignments/${id}/submissions/mine`);
                setResult(data);
            } catch (err) {
                setError(err.response?.data?.errors?.[0] || "Failed to load result.");
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, [id]);

    return { result, loading, error };
}