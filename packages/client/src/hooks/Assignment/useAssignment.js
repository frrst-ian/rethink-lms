import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { client } from "../../helpers/axiosClient";

export default function useAssignment() {
    const [assignment, setAssignment] = useState(null);
    const [errors, setErrors] = useState([]);
    const [loading, setLoading] = useState(true);

    const { assignmentId } = useParams();

    useEffect(() => {
        const fetchAssignment = async () => {
            try {
                const res = await client.get(`/assignments/${assignmentId}`);
                setAssignment(res.data);
            } catch (err) {
                const errorMessages = err.response?.data?.errors || [
                    "An unexpected error occurred",
                ];
                setErrors(errorMessages);
            } finally {
                setLoading(false);
            }
        };
        fetchAssignment();
    }, [assignmentId]);

    return { assignment, errors, loading };
}