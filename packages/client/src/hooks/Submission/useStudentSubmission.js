import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { client } from "../../helpers/axiosClient";
import { useAuth } from "../../context/AuthContext";

export default function useStudentSubmission() {
    const [submission, setSubmission] = useState(null);
    const [loading, setLoading] = useState(true);

    const { assignmentId } = useParams();
    const { user } = useAuth();

    useEffect(() => {
        if (user?.role !== "student") {
            setLoading(false);
            return;
        }

        const fetch = async () => {
            try {
                const { data } = await client.get(
                    `/assignments/${assignmentId}/submissions/mine`,
                );
                setSubmission(data);
            } catch {
                setSubmission(null);
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, [assignmentId, user]);

    return { submission, setSubmission, loading };
}