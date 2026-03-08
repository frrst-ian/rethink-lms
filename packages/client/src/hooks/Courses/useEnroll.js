import { useState } from "react";
import { client } from "../../helpers/axiosClient";

export default function useEnroll(onSuccess) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const enroll = async (code) => {
        try {
            setLoading(true);
            setError(null);

            const { data: courses } = await client.get("/courses");
            const course = courses.find((c) => c.code === code.trim().toUpperCase());

            if (!course) {
                setError("Invalid course code.");
                return;
            }

            await client.post(`/courses/${course.id}/enroll`);
            onSuccess(course);
        } catch (err) {
            const msg = err.response?.data?.error || "Failed to enroll.";
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return { enroll, loading, error };
}