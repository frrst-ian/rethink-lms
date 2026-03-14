import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CalendarClock, ChevronLeft, Upload, FileText, X, ClipboardList, BookOpen } from "lucide-react";
import useAssignment from "../../hooks/Assignment/useAssignment";
import useStudentSubmission from "../../hooks/Submission/useStudentSubmission";
import useSubmitAssignment from "../../hooks/Assignment/useSubmitAssignment";
import useAllSubmissions from "../../hooks/Assignment/useAllSubmissions";
import useResetSubmission from "../../hooks/Assignment/useResetSubmission";
import FileViewer from "../../components/FileViewer/FileViewer";
import { useAuth } from "../../context/AuthContext";
import styles from "./assignment.module.css";

const ALLOWED_TYPES = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const TABS = [
    { id: "details", label: "Details", icon: BookOpen },
    { id: "submissions", label: "Submissions", icon: ClipboardList },
];

function SubmissionsTab({ assignmentId }) {
    const { submissions, setSubmissions, loading } = useAllSubmissions(assignmentId);
    const { reset, resettingId } = useResetSubmission(assignmentId);
    const [confirmId, setConfirmId] = useState(null);

    const handleReset = async (studentId) => {
        await reset(studentId, (id) => {
            setSubmissions((prev) => prev.filter((s) => s.user.id !== id));
            setConfirmId(null);
        });
    };

    if (loading) return <div className={styles.tabLoading}>Loading submissions...</div>;
    if (submissions.length === 0) return <p className={styles.empty}>No submissions yet.</p>;

    return (
        <div className={styles.submissionTable}>
            <div className={styles.tableHeader}>
                <span>Student</span>
                <span>Submitted</span>
                <span>AI Score</span>
                <span>Status</span>
                <span></span>
            </div>
            {submissions.map((s) => (
                <div key={s.id} className={styles.tableRow}>
                    <div className={styles.studentCell}>
                        {s.user.profilePicture && (
                            <img src={s.user.profilePicture} alt={s.user.name} width={26} height={26} className={styles.avatar} />
                        )}
                        <div>
                            <p className={styles.studentName}>{s.user.name}</p>
                            <p className={styles.studentEmail}>{s.user.email}</p>
                        </div>
                    </div>
                    <span className={styles.dateCell}>
                        {new Date(s.submittedAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                    <span className={styles.scoreCell}>
                        {s.result?.ai_percentage != null
                            ? `${s.result.ai_percentage}%`
                            : <span className={styles.skippedBadge}>Too short</span>}
                    </span>
                    <span>
                        {s.result ? (
                            s.result.isFlagged
                                ? <span className={styles.flaggedBadge}>Flagged</span>
                                : <span className={styles.cleanBadge}>Clean</span>
                        ) : (
                            <span className={styles.skippedBadge}>N/A</span>
                        )}
                    </span>
                    <span className={styles.resetCell}>
                        {confirmId === s.user.id ? (
                            <div className={styles.confirmRow}>
                                <span className={styles.confirmText}>Reset?</span>
                                <button
                                    className={styles.confirmYes}
                                    onClick={() => handleReset(s.user.id)}
                                    disabled={resettingId === s.user.id}
                                >
                                    {resettingId === s.user.id ? "..." : "Yes"}
                                </button>
                                <button className={styles.confirmNo} onClick={() => setConfirmId(null)}>No</button>
                            </div>
                        ) : (
                            <button className={styles.resetBtn} onClick={() => setConfirmId(s.user.id)}>
                                Reset
                            </button>
                        )}
                    </span>
                </div>
            ))}
        </div>
    );
}

export default function Assignment() {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const { assignment, errors, loading } = useAssignment();
    const { submission, setSubmission, loading: subLoading } = useStudentSubmission();
    const { submit, error: submitError, submitting } = useSubmitAssignment();

    const [tab, setTab] = useState("details");
    const [mode, setMode] = useState("text");
    const [content, setContent] = useState("");
    const [file, setFile] = useState(null);
    const [fileError, setFileError] = useState(null);

    const handleFileChange = (e) => {
        const picked = e.target.files[0];
        if (!picked) return;
        if (!ALLOWED_TYPES.includes(picked.type)) {
            setFileError("Only PDF or DOCX files are allowed.");
            return;
        }
        setFileError(null);
        setFile(picked);
    };

    const handleSubmit = async () => {
        if (mode === "text" && !content.trim()) return;
        if (mode === "file" && !file) return;

        const data = await submit({
            content: mode === "text" ? content : null,
            file: mode === "file" ? file : null,
        });

        if (data) {
            setSubmission(data.submission);
            navigate(`/assignments/${assignment.id}/result`, {
                state: { result: data },
            });
        }
    };

    if (loading || subLoading) return <div className="loading">Loading...</div>;
    if (errors.length > 0) return <div className="loading">Failed to load assignment.</div>;

    const isOverdue = new Date(assignment.dueDate) < new Date();

    return (
        <div className={styles.wrapper}>
            <button className={styles.back} onClick={() => navigate(`/courses/${courseId}`)}>
                <ChevronLeft size={16} strokeWidth={1.75} />
                Back to Course
            </button>

            <div className={styles.header}>
                <h2 className={styles.title}>{assignment.title}</h2>
                <p className={`${styles.due} ${isOverdue ? styles.overdue : ""}`}>
                    <CalendarClock size={14} strokeWidth={1.75} />
                    Due {new Date(assignment.dueDate).toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })}
                    {isOverdue && " · Overdue"}
                </p>
            </div>

            {user.role === "teacher" && (
                <div className={styles.tabsRow}>
                    {TABS.map(({ id, label, icon: Icon }) => (
                        <button
                            key={id}
                            className={`${styles.tabBtn} ${tab === id ? styles.activeTab : ""}`}
                            onClick={() => setTab(id)}
                        >
                            <Icon size={14} strokeWidth={1.75} />
                            {label}
                        </button>
                    ))}
                </div>
            )}

            {(user.role === "student" || tab === "details") && (
                <>
                    <div className={styles.card}>
                        <p className={styles.cardLabel}>Description</p>
                        <p className={styles.description}>{assignment.description}</p>
                    </div>

                    {assignment.fileUrl && (
                        <div className={styles.card}>
                            <FileViewer fileUrl={assignment.fileUrl} fileType={assignment.fileType} label="Assignment File" />
                        </div>
                    )}

                    {user.role === "student" && (
                        <div className={styles.card}>
                            <p className={styles.cardLabel}>Your Submission</p>
                            {submission ? (
                                <div className={styles.alreadySubmitted}>
                                    <span className={styles.badge}>Submitted</span>
                                    <p className={styles.submittedHint}>
                                        Submitted on {new Date(submission.submittedAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}.{" "}
                                        <button className={styles.viewResultBtn} onClick={() => navigate(`/assignments/${assignment.id}/result`)}>
                                            View Result →
                                        </button>
                                    </p>
                                </div>
                            ) : (
                                <>
                                    <div className={styles.modeToggle}>
                                        <button className={`${styles.modeBtn} ${mode === "text" ? styles.activeModeBtn : ""}`} onClick={() => setMode("text")}>Write Text</button>
                                        <button className={`${styles.modeBtn} ${mode === "file" ? styles.activeModeBtn : ""}`} onClick={() => setMode("file")}>Upload File</button>
                                    </div>

                                    {mode === "text" ? (
                                        <textarea className={styles.textarea} placeholder="Write your answer here..." value={content} onChange={(e) => setContent(e.target.value)} rows={8} />
                                    ) : (
                                        <div className={styles.fileZone}>
                                            {file ? (
                                                <div className={styles.filePill}>
                                                    <FileText size={16} strokeWidth={1.75} />
                                                    <span>{file.name}</span>
                                                    <button className={styles.removeFile} onClick={() => setFile(null)}><X size={14} /></button>
                                                </div>
                                            ) : (
                                                <label className={styles.fileLabel}>
                                                    <Upload size={20} strokeWidth={1.75} />
                                                    <span>Click to upload PDF or DOCX</span>
                                                    <input type="file" accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={handleFileChange} className={styles.hiddenInput} />
                                                </label>
                                            )}
                                            {fileError && <p className={styles.error}>{fileError}</p>}
                                        </div>
                                    )}

                                    {submitError && <p className={styles.error}>{submitError}</p>}

                                    <button
                                        className={styles.submitBtn}
                                        onClick={handleSubmit}
                                        disabled={submitting || (mode === "text" && !content.trim()) || (mode === "file" && !file)}
                                    >
                                        {submitting ? "Submitting..." : "Submit Assignment"}
                                    </button>
                                </>
                            )}
                        </div>
                    )}
                </>
            )}

            {user.role === "teacher" && tab === "submissions" && (
                <SubmissionsTab assignmentId={assignment.id} />
            )}
        </div>
    );
}