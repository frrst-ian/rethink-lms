import { useState, useEffect } from "react";
import { client } from "../../helpers/axiosClient";
import { useAuth } from "../../context/AuthContext";

export default function useDashboard() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        const fetch = async () => {
            try {
                const endpoint = user.role === "teacher" ? "/dashboard/teacher" : "/dashboard/student";
                const { data: res } = await client.get(endpoint);
                setData(res);
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, [user.role]);

    return { data, loading };
}