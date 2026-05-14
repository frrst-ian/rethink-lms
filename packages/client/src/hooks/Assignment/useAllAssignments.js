import { useState, useEffect } from "react";
import { client } from "../../helpers/axiosClient";

export default function useAllAssignments() {
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetch = async () => {
            try {
                const { data } = await client.get("/assignments");
                setAssignments(data);
            } catch (err) {
                setError(err.response?.data?.errors?.[0] || "Failed to load assignments.");
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, []);

    return { assignments, loading, error };
}