import { useState } from "react";
import { client } from "../../helpers/axiosClient";

export default function useResetSubmission(assignmentId) {
    const [resettingId, setResettingId] = useState(null);

    const reset = async (studentId, onSuccess) => {
        try {
            setResettingId(studentId);
            await client.delete(`/assignments/${assignmentId}/submissions/reset`, {
                data: { studentId },
            });
            onSuccess(studentId);
        } finally {
            setResettingId(null);
        }
    };

    return { reset, resettingId };
}