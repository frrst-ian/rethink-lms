import {
    LayoutDashboard,
    BookOpen,
    PanelLeftClose,
    PanelLeftOpen,
    LogOut,
    Menu,
    X,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import styles from "./sidebar.module.css";
import NotificationBell from "../NotificationBell/NotificationBell";

const NAV_ITEMS = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: BookOpen, label: "Courses", href: "/courses" },
];

export default function Sidebar({ open, setOpen }) {
    const { pathname } = useLocation();
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <>
            <header className={styles.mobileHeader}>
                <span className={styles.mobileLogo}>Rethink</span>
                <button
                    className={styles.mobileMenuBtn}
                    onClick={() => setOpen((o) => !o)}
                    aria-label="Toggle menu"
                >
                    {open ? (
                        <X size={20} strokeWidth={1.75} />
                    ) : (
                        <Menu size={20} strokeWidth={1.75} />
                    )}
                </button>
            </header>

            {open && (
                <div
                    className={styles.overlay}
                    onClick={() => setOpen(false)}
                />
            )}

            {/* Sidebar */}
            <nav className={`${styles.sidebar} ${open ? styles.expanded : ""}`}>
                <div className={styles.header}>
                    <span className={styles.logo}>Rethink</span>
                    <button
                        className={styles.toggleBtn}
                        onClick={() => setOpen((o) => !o)}
                        aria-label={
                            open ? "Collapse sidebar" : "Expand sidebar"
                        }
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
                        onClick={() => setOpen(false)}
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
                <NotificationBell sidebarOpen={open} /> 
                    <div
                        className={styles.profile}
                        data-label={user?.name}
                        aria-label={user?.name}
                    >
                        <img
                            src={user?.profilePicture}
                            alt={user?.name}
                            loading="lazy"
                            className={styles.avatar}
                        />
                        <div className={styles.profileInfo}>
                            <p className={styles.profileName}>{user?.name}</p>
                            <p className={styles.profileRole}>{user?.role}</p>
                        </div>
                    </div>

                    <button
                        className={`${styles.navItem} ${styles.logoutBtn}`}
                        onClick={handleLogout}
                        data-label="Logout"
                        aria-label="Logout"
                    >
                        <LogOut
                            size={20}
                            strokeWidth={1.75}
                            className={styles.icon}
                        />
                        <span className={styles.label}>Logout</span>
                    </button>
                </div>
            </nav>
        </>
    );
}
