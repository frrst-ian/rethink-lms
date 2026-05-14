import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarClock, X, FileText, CheckCircle, Clock, AlertTriangle } from "lucide-react";
import useAllAssignments from "../../hooks/Assignment/useAllAssignments";
import FileViewer from "../../components/FileViewer/FileViewer";
import { useAuth } from "../../context/AuthContext";
import styles from "./assignments.module.css";

function StatusBadge({ submission }) {
    if (!submission) {
        return <span className={styles.pendingBadge}><Clock size={11} /> Not submitted</span>;
    }
    if (submission.result?.isFlagged) {
        return <span className={styles.flaggedBadge}><AlertTriangle size={11} /> Flagged</span>;
    }
    return <span className={styles.doneBadge}><CheckCircle size={11} /> Submitted</span>;
}

function AssignmentModal({ assignment, onClose, user, navigate }) {
    const submission = assignment.submissions?.[0] ?? null;
    const isOverdue = new Date(assignment.dueDate) < new Date();

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <div>
                        <p className={styles.modalCourse}>{assignment.course.title}</p>
                        <h3 className={styles.modalTitle}>{assignment.title}</h3>
                        <p className={`${styles.modalDue} ${isOverdue ? styles.overdue : ""}`}>
                            <CalendarClock size={13} strokeWidth={1.75} />
                            Due {new Date(assignment.dueDate).toLocaleDateString(undefined, {
                                month: "long", day: "numeric", year: "numeric",
                            })}
                            {isOverdue && " · Overdue"}
                        </p>
                    </div>
                    <button className={styles.closeBtn} onClick={onClose}>
                        <X size={18} />
                    </button>
                </div>

                <div className={styles.modalBody}>
                    <div className={styles.section}>
                        <p className={styles.sectionLabel}>Description</p>
                        <p className={styles.description}>{assignment.description}</p>
                    </div>

                    {assignment.fileUrl && (
                        <div className={styles.section}>
                            <FileViewer
                                fileUrl={assignment.fileUrl}
                                fileType={assignment.fileType}
                                label="Assignment File"
                            />
                        </div>
                    )}

                    {user.role === "student" && (
                        <div className={styles.section}>
                            <p className={styles.sectionLabel}>Your Submission</p>
                            {submission ? (
                                <div className={styles.submittedRow}>
                                    <StatusBadge submission={submission} />
                                    <button
                                        className={styles.viewResultBtn}
                                        onClick={() => {
                                            onClose();
                                            navigate(`/assignments/${assignment.id}/result`);
                                        }}
                                    >
                                        View Result →
                                    </button>
                                </div>
                            ) : (
                                <div className={styles.submittedRow}>
                                    <StatusBadge submission={null} />
                                    <button
                                        className={styles.goSubmitBtn}
                                        onClick={() => {
                                            onClose();
                                            navigate(`/courses/${assignment.course.id}/assignments/${assignment.id}`);
                                        }}
                                    >
                                        Submit Assignment →
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {user.role === "teacher" && (
                        <div className={styles.section}>
                            <p className={styles.sectionLabel}>Submissions</p>
                            <p className={styles.stat}>
                                {assignment._count?.submissions ?? 0} student{assignment._count?.submissions !== 1 ? "s" : ""} submitted
                            </p>
                            <button
                                className={styles.goSubmitBtn}
                                onClick={() => {
                                    onClose();
                                    navigate(`/courses/${assignment.courseId}/assignments/${assignment.id}`);
                                }}
                            >
                                View Submissions →
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function Assignments() {
    const { assignments, loading, error } = useAllAssignments();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [selected, setSelected] = useState(null);

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="loading">{error}</div>;

    const grouped = assignments.reduce((acc, a) => {
        const key = a.course.title;
        if (!acc[key]) acc[key] = [];
        acc[key].push(a);
        return acc;
    }, {});

    return (
        <div className={styles.wrapper}>
            <div className={styles.pageHeader}>
                <h1 className={styles.pageTitle}>Assignments</h1>
                <p className={styles.pageSub}>
                    {user.role === "teacher"
                        ? "All assignments you've created across your courses"
                        : "All assignments across your enrolled courses"}
                </p>
            </div>

            {assignments.length === 0 ? (
                <p className={styles.empty}>No assignments yet.</p>
            ) : (
                Object.entries(grouped).map(([courseTitle, items]) => (
                    <div key={courseTitle} className={styles.group}>
                        <p className={styles.groupLabel}>{courseTitle}</p>
                        <div className={styles.list}>
                            {items.map((a) => {
                                const isOverdue = new Date(a.dueDate) < new Date();
                                const submission = a.submissions?.[0] ?? null;

                                return (
                                    <button
                                        key={a.id}
                                        className={styles.row}
                                        onClick={() => setSelected(a)}
                                    >
                                        <div className={styles.rowLeft}>
                                            <FileText size={15} strokeWidth={1.75} className={styles.rowIcon} />
                                            <div>
                                                <p className={styles.rowTitle}>{a.title}</p>
                                                <p className={`${styles.rowDue} ${isOverdue ? styles.overdue : ""}`}>
                                                    <CalendarClock size={11} strokeWidth={1.75} />
                                                    Due {new Date(a.dueDate).toLocaleDateString(undefined, {
                                                        month: "short", day: "numeric", year: "numeric",
                                                    })}
                                                    {isOverdue && " · Overdue"}
                                                </p>
                                            </div>
                                        </div>
                                        <div className={styles.rowRight}>
                                            {user.role === "student" && (
                                                <StatusBadge submission={submission} />
                                            )}
                                            {user.role === "teacher" && (
                                                <span className={styles.countBadge}>
                                                    {a._count?.submissions ?? 0} submitted
                                                </span>
                                            )}
                                            {a.fileUrl && (
                                                <span className={styles.attachBadge}>
                                                    <FileText size={11} /> File
                                                </span>
                                            )}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ))
            )}

            {selected && (
                <AssignmentModal
                    assignment={selected}
                    onClose={() => setSelected(null)}
                    user={user}
                    navigate={navigate}
                />
            )}
        </div>
    );
}