import { useEffect, useRef, useState } from "react";
import { Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useNotifications from "../../hooks/Notifications/useNotifications";
import styles from "./notification-bell.module.css";

export default function NotificationBell({ sidebarOpen }) {
    const { notifications, unreadCount, markAllRead, markOneRead } = useNotifications();
    const [open, setOpen] = useState(false);
    const ref = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const handler = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const handleClick = (n) => {
        markOneRead(n.id);
        setOpen(false);
        if (n.link) navigate(n.link);
    };

    const handleOpen = () => {
        setOpen((o) => !o);
    };

    return (
        <div className={styles.wrapper} ref={ref}>
            <button
                className={`${styles.bell} ${sidebarOpen ? styles.bellExpanded : ""}`}
                onClick={handleOpen}
                aria-label="Notifications"
                data-label="Notifications"
            >
                <Bell size={20} strokeWidth={1.75} />
                {unreadCount > 0 && (
                    <span className={styles.badge}>
                        {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                )}
                {sidebarOpen && <span className={styles.bellLabel}>Notifications</span>}
            </button>

            {open && (
                <div className={styles.dropdown}>
                    <div className={styles.dropdownHeader}>
                        <span className={styles.dropdownTitle}>Notifications</span>
                        {unreadCount > 0 && (
                            <button className={styles.markAll} onClick={markAllRead}>
                                Mark all read
                            </button>
                        )}
                    </div>
                    <div className={styles.list}>
                        {notifications.length === 0 ? (
                            <p className={styles.empty}>No notifications yet.</p>
                        ) : (
                            notifications.map((n) => (
                                <button
                                    key={n.id}
                                    className={`${styles.item} ${!n.read ? styles.unread : ""}`}
                                    onClick={() => handleClick(n)}
                                >
                                    {!n.read && <span className={styles.dot} />}
                                    <div className={styles.itemContent}>
                                        <p className={styles.itemMsg}>{n.message}</p>
                                        <p className={styles.itemTime}>
                                            {new Date(n.createdAt).toLocaleDateString(undefined, {
                                                month: "short",
                                                day: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </p>
                                    </div>
                                </button>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}