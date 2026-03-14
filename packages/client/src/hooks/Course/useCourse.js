import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { client } from "../../helpers/axiosClient";

export default function useCourse() {
    const [course, setCourse] = useState(null);
    const [errors, setErrors] = useState([]);
    const [loading, setLoading] = useState(true);

    const { id } = useParams();

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const res = await client.get(`/courses/${id}`);
                setCourse(res.data);
            } catch (err) {
                console.error("Error fetching post:", err);
                const errorMessages = err.response?.data?.errors || [
                    "An unexpected error occurred",
                ];
                setErrors(errorMessages);
            } finally {
                setLoading(false);
            }
        };
        fetchCourse();
    }, [id]);

    return { course, setCourse, errors, loading };
}
