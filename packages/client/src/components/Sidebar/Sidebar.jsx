import {
    LayoutDashboard,
    BookOpen,
    ClipboardList,
    Users,
    Settings,
    PanelLeftClose,
    PanelLeftOpen,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import styles from "./sidebar.module.css";

const NAV_ITEMS = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: BookOpen, label: "Courses", href: "/courses" },
    { icon: ClipboardList, label: "Assignments", href: "/assignments" },
    { icon: Users, label: "Students", href: "/students" },
];

export default function Sidebar({ open, setOpen }) {
    const { pathname } = useLocation();

    return (
        <nav className={`${styles.sidebar} ${open ? styles.expanded : ""}`}>
            <div className={styles.header}>
                <span className={styles.logo}>Rethink</span>
                <button
                    className={styles.toggleBtn}
                    onClick={() => setOpen((o) => !o)}
                    aria-label={open ? "Collapse sidebar" : "Expand sidebar"}
                >
                    {open ? (
                        <PanelLeftClose size={18} strokeWidth={1.75} />
                    ) : (
                        <PanelLeftOpen size={18} strokeWidth={1.75} />
                    )}
                </button>
            </div>

            {NAV_ITEMS.map(({ icon: Icon, label, href }) => (
                <Link
                    key={label}
                    to={href}
                    className={`${styles.navItem} ${pathname === href ? styles.active : ""}`}
                    data-label={label}
                    aria-label={label}
                >
                    <Icon
                        size={20}
                        strokeWidth={1.75}
                        className={styles.icon}
                    />
                    <span className={styles.label}>{label}</span>
                </Link>
            ))}

            <div className={styles.bottom}>
                <Link
                    to="/settings"
                    className={`${styles.navItem} ${pathname === "/settings" ? styles.active : ""}`}
                    data-label="Settings"
                    aria-label="Settings"
                >
                    <Settings
                        size={20}
                        strokeWidth={1.75}
                        className={styles.icon}
                    />
                    <span className={styles.label}>Settings</span>
                </Link>
            </div>
        </nav>
    );
}
