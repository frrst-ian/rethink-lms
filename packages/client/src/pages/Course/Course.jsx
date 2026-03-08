import { useState } from "react";
import useCourse from "../../hooks/Course/useCourse";
import styles from "./course.module.css";
import { LayoutGrid, Users, ClipboardList, CalendarClock } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const TABS = [
    { id: "overview", label: "Overview", icon: LayoutGrid },
    { id: "people", label: "People", icon: Users },
    { id: "assignments", label: "Assignments", icon: ClipboardList },
];

export default function Course() {
    const { course, errors, loading } = useCourse();
    const [tab, setTab] = useState("overview");
    const { user } = useAuth();

    if (loading) return <div className="loading">Loading...</div>;
    if (errors.length > 0)
        return <div className="error">Failed to load course.</div>;

    const sortedAssignments = [...(course.assignments ?? [])].sort(
        (a, b) => new Date(b.dueDate) - new Date(a.dueDate),
    );

    const students = course.enrollments.map((e) => e.user);

    return (
        <div className={styles.courseWrapper}>
            {/* Header */}
            <div className={styles.header}>
                <div>
                    <h2 className={styles.title}>{course.title}</h2>
                    <p className={styles.meta}>
                        {course.section} · 
                        {user.role === "teacher" && (
                            <span className={styles.code}>{course.code}</span>
                        )}
                    </p>
                </div>
            </div>

            {/* Tabs */}
            <div className={styles.tabs}>
                {TABS.map(({ id, label, icon: Icon }) => (
                    <button
                        key={id}
                        className={`${styles.tab} ${tab === id ? styles.activeTab : ""}`}
                        onClick={() => setTab(id)}
                    >
                        <Icon size={15} strokeWidth={1.75} />
                        {label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className={styles.content}>
                {tab === "overview" && (
                    <div className={styles.overview}>
                        <div className={styles.card}>
                            <p className={styles.cardLabel}>Instructor</p>
                            <div className={styles.personRow}>
                                <img
                                    src={course.createdBy.profilePicture}
                                    alt={course.createdBy.name}
                                    className={styles.avatar}
                                    width={38}
                                    height={38}
                                />
                                <div>
                                    <p className={styles.personName}>
                                        {course.createdBy.name}
                                    </p>
                                    <p className={styles.personEmail}>
                                        {course.createdBy.email}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className={styles.card}>
                            <p className={styles.cardLabel}>Stats</p>
                            <p className={styles.stat}>
                                {course._count.enrollments}
                                <span>Students</span>
                            </p>
                            <p className={styles.stat}>
                                {course.assignments.length}
                                <span>Assignments</span>
                            </p>
                        </div>
                    </div>
                )}

                {tab === "people" && (
                    <div className={styles.peopleList}>
                        <p className={styles.groupLabel}>Instructor</p>
                        <div className={styles.personRow}>
                            <img
                                src={course.createdBy.profilePicture}
                                alt={course.createdBy.name}
                                className={styles.avatar}
                                width={38}
                                height={38}
                            />
                            <div>
                                <p className={styles.personName}>
                                    {course.createdBy.name}
                                </p>
                                <p className={styles.personEmail}>
                                    {course.createdBy.email}
                                </p>
                            </div>
                        </div>

                        <p
                            className={styles.groupLabel}
                            style={{ marginTop: "1.5rem" }}
                        >
                            Students ({students.length})
                        </p>
                        {students.length === 0 ? (
                            <p className={styles.empty}>
                                No students enrolled yet.
                            </p>
                        ) : (
                            students.map((s) => (
                                <div key={s.id} className={styles.personRow}>
                                    {s.profilePicture && (
                                        <img
                                            src={s.profilePicture}
                                            alt={s.name}
                                            className={styles.avatar}
                                            width={38}
                                            height={38}
                                        />
                                    )}
                                    <div>
                                        <p className={styles.personName}>
                                            {s.name}
                                        </p>
                                        <p className={styles.personEmail}>
                                            {s.email}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {tab === "assignments" && (
                    <div className={styles.assignmentList}>
                        {sortedAssignments.length === 0 ? (
                            <p className={styles.empty}>No assignments yet.</p>
                        ) : (
                            sortedAssignments.map((a) => (
                                <div
                                    key={a.id}
                                    className={styles.assignmentCard}
                                >
                                    <p className={styles.assignmentTitle}>
                                        {a.title}
                                    </p>
                                    <p className={styles.dueDate}>
                                        <CalendarClock
                                            size={13}
                                            strokeWidth={1.75}
                                        />
                                        Due{" "}
                                        {new Date(a.dueDate).toLocaleDateString(
                                            undefined,
                                            {
                                                month: "short",
                                                day: "numeric",
                                                year: "numeric",
                                            },
                                        )}
                                    </p>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
