import { useState } from "react";
import { client } from "../../helpers/axiosClient";

export default function useEnroll(onSuccess) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const enroll = async (code) => {
        try {
            setLoading(true);
            setError(null);

            const { data: course } = await client.get(
                `/courses/by-code/${code.trim().toUpperCase()}`,
            );

            await client.post(`/courses/${course.id}/enroll`);
            onSuccess(course);
        } catch (err) {
            const status = err.response?.status;
            if (status === 404) {
                setError("Invalid course code.");
            } else if (status === 409) {
                setError("You are already enrolled in this course.");
            } else {
                setError(err.response?.data?.errors?.[0] || "Failed to enroll.");
            }
        } finally {
            setLoading(false);
        }
    };

    return { enroll, loading, error };
}