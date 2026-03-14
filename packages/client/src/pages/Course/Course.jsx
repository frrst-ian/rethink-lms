import { useState } from "react";
import { NavLink } from "react-router-dom";
import useCourse from "../../hooks/Course/useCourse";
import useCreateAssignment from "../../hooks/Assignment/useCreateAssignment";
import styles from "./course.module.css";
import { LayoutGrid, Users, ClipboardList, CalendarClock, X, FileText } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const TABS = [
    { id: "overview", label: "Overview", icon: LayoutGrid },
    { id: "people", label: "People", icon: Users },
    { id: "assignments", label: "Assignments", icon: ClipboardList },
];

const ALLOWED_TYPES = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

function CreateAssignmentModal({ onClose, onCreated }) {
    const { createAssignment, loading, error } = useCreateAssignment(onCreated);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [dueDate, setDueDate] = useState("");
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim() || !description.trim() || !dueDate) return;
        await createAssignment(title, description, dueDate, file);
    };

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h3>Create Assignment</h3>
                    <button className={styles.closeBtn} onClick={onClose}>
                        <X size={18} />
                    </button>
                </div>
                <form className={styles.modalForm} onSubmit={handleSubmit}>
                    <div className={styles.fieldGroup}>
                        <label htmlFor="a-title">
                            Title <span className={styles.required}>*</span>
                        </label>
                        <input
                            id="a-title"
                            className={styles.modalInput}
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. Essay on Climate Change"
                            required
                        />
                    </div>
                    <div className={styles.fieldGroup}>
                        <label htmlFor="a-desc">
                            Description <span className={styles.required}>*</span>
                        </label>
                        <textarea
                            id="a-desc"
                            className={`${styles.modalInput} ${styles.modalTextarea}`}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Instructions for students..."
                            rows={3}
                            required
                        />
                    </div>
                    <div className={styles.fieldGroup}>
                        <label htmlFor="a-due">
                            Due Date <span className={styles.required}>*</span>
                        </label>
                        <input
                            id="a-due"
                            className={styles.modalInput}
                            type="datetime-local"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            required
                        />
                    </div>
                    <div className={styles.fieldGroup}>
                        <label>
                            Attachment <span className={styles.optional}>(optional)</span>
                        </label>
                        {file ? (
                            <div className={styles.filePill}>
                                <FileText size={14} strokeWidth={1.75} />
                                <span>{file.name}</span>
                                <button
                                    type="button"
                                    className={styles.removeFile}
                                    onClick={() => setFile(null)}
                                >
                                    <X size={13} />
                                </button>
                            </div>
                        ) : (
                            <label className={styles.filePickerLabel}>
                                Click to attach PDF or DOCX
                                <input
                                    type="file"
                                    accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                    onChange={handleFileChange}
                                    className={styles.hiddenInput}
                                />
                            </label>
                        )}
                        {fileError && <p className={styles.modalError}>{fileError}</p>}
                    </div>
                    {error && <p className={styles.modalError}>{error}</p>}
                    <div className={styles.modalActions}>
                        <button type="button" className={styles.cancelBtn} onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className={styles.createBtn} disabled={loading}>
                            {loading ? "Creating..." : "Create Assignment"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function Course() {
    const { course, setCourse, errors, loading } = useCourse();
    const [tab, setTab] = useState("overview");
    const [assignmentModalOpen, setAssignmentModalOpen] = useState(false);
    const { user } = useAuth();

    if (loading) return <div className="loading">Loading...</div>;
    if (errors.length > 0) return <div className="error">Failed to load course.</div>;

    const students = course.enrollments.map((e) => e.user);

    const handleAssignmentCreated = (newAssignment) => {
        setCourse((prev) => ({
            ...prev,
            assignments: [newAssignment, ...prev.assignments],
        }));
        setAssignmentModalOpen(false);
    };

    return (
        <div className={styles.courseWrapper}>
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
                                    <p className={styles.personName}>{course.createdBy.name}</p>
                                    <p className={styles.personEmail}>{course.createdBy.email}</p>
                                </div>
                            </div>
                        </div>
                        <div className={styles.card}>
                            <p className={styles.cardLabel}>Stats</p>
                            <p className={styles.stat}>
                                {course._count.enrollments}<span>Students</span>
                            </p>
                            <p className={styles.stat}>
                                {course.assignments.length}<span>Assignments</span>
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
                                <p className={styles.personName}>{course.createdBy.name}</p>
                                <p className={styles.personEmail}>{course.createdBy.email}</p>
                            </div>
                        </div>

                        <p className={styles.groupLabel} style={{ marginTop: "1.5rem" }}>
                            Students ({students.length})
                        </p>
                        {students.length === 0 ? (
                            <p className={styles.empty}>No students enrolled yet.</p>
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
                                        <p className={styles.personName}>{s.name}</p>
                                        <p className={styles.personEmail}>{s.email}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {tab === "assignments" && (
                    <div className={styles.assignmentList}>
                        {user.role === "teacher" && (
                            <button
                                className={styles.addAssignmentBtn}
                                onClick={() => setAssignmentModalOpen(true)}
                            >
                                + Add Assignment
                            </button>
                        )}
                        {course.assignments.length === 0 ? (
                            <p className={styles.empty}>No assignments yet.</p>
                        ) : (
                            course.assignments.map((a) => (
                                <NavLink
                                    key={a.id}
                                    to={`/courses/${course.id}/assignments/${a.id}`}
                                    className={styles.assignmentCard}
                                >
                                    <p className={styles.assignmentTitle}>{a.title}</p>
                                    <p className={styles.dueDate}>
                                        <CalendarClock size={13} strokeWidth={1.75}  />
                                        Due{" "}
                                        {new Date(a.dueDate).toLocaleDateString(undefined, {
                                            month: "short",
                                            day: "numeric",
                                            year: "numeric",
                                        })}
                                    </p>
                                </NavLink>
                            ))
                        )}
                    </div>
                )}
            </div>

            {assignmentModalOpen && (
                <CreateAssignmentModal
                    onClose={() => setAssignmentModalOpen(false)}
                    onCreated={handleAssignmentCreated}
                />
            )}
        </div>
    );
}