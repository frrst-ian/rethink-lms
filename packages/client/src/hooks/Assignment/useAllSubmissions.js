import { useState, useEffect } from "react";
import { client } from "../../helpers/axiosClient";

export default function useAllSubmissions(assignmentId) {
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            try {
                const { data } = await client.get(`/assignments/${assignmentId}/submissions`);
                setSubmissions(data);
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, [assignmentId]);

    return { submissions, loading };
}