import { useState } from "react";
import { client } from "../../helpers/axiosClient";

export default function useDeleteMaterial(courseId, onSuccess) {
    const [deletingId, setDeletingId] = useState(null);

    const deleteMaterial = async (id) => {
        try {
            setDeletingId(id);
            await client.delete(`/courses/${courseId}/materials/${id}`);
            onSuccess(id);
        } finally {
            setDeletingId(null);
        }
    };

    return { deleteMaterial, deletingId };
}