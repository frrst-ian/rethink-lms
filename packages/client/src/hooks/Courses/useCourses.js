import { useState, useEffect } from "react";
import { client } from "../../helpers/axiosClient";

export default function useCourses() {
    const [courses, setCourses] = useState([]);
    const [errors, setErrors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const res = await client.get("/courses");

                setCourses(res.data);
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
        fetchCourses();
    }, []);

    return { courses, errors, loading };
}
