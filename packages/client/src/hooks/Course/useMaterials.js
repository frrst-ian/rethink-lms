import { useState } from "react";
import { client } from "../../helpers/axiosClient";

export default function useMaterials(courseId) {
    const [materials, setMaterials] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetched, setFetched] = useState(false);

    const fetchMaterials = async () => {
        if (fetched) return;
        try {
            setLoading(true);
            const { data } = await client.get(`/courses/${courseId}/materials`);
            setMaterials(data);
            setFetched(true);
        } finally {
            setLoading(false);
        }
    };

    return { materials, setMaterials, loading, fetchMaterials };
}