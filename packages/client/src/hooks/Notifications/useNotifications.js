import { useState, useEffect, useCallback } from "react";
import { client } from "../../helpers/axiosClient";

export default function useNotifications() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetch = useCallback(async () => {
        try {
            const { data } = await client.get("/notifications");
            setNotifications(data);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetch();
    }, [fetch]);

    const markAllRead = async () => {
        await client.patch("/notifications/read-all");
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    };

    const markOneRead = async (id) => {
        await client.patch(`/notifications/${id}/read`);
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, read: true } : n))
        );
    };

    const unreadCount = notifications.filter((n) => !n.read).length;

    return { notifications, loading, unreadCount, markAllRead, markOneRead };
}