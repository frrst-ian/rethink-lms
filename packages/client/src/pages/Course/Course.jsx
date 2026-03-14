import { useState } from "react";
import { NavLink } from "react-router-dom";
import useCourse from "../../hooks/Course/useCourse";
import useCreateAssignment from "../../hooks/Assignment/useCreateAssignment";
import useMaterials from "../../hooks/Course/useMaterials";
import useCreateMaterial from "../../hooks/Course/useCreateMaterial";
import useDeleteMaterial from "../../hooks/Course/useDeleteMaterial";
import styles from "./course.module.css";
import {
    LayoutGrid,
    Users,
    ClipboardList,
    CalendarClock,
    X,
    FileText,
    BookMarked,
    Trash2,
    FileUp,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const TABS = [
    { id: "overview", label: "Overview", icon: LayoutGrid },
    { id: "people", label: "People", icon: Users },
    { id: "assignments", label: "Assignments", icon: ClipboardList },
    { id: "materials", label: "Materials", icon: BookMarked },
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
                            Description{" "}
                            <span className={styles.required}>*</span>
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
                            Attachment{" "}
                            <span className={styles.optional}>(optional)</span>
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
                        {fileError && (
                            <p className={styles.modalError}>{fileError}</p>
                        )}
                    </div>
                    {error && <p className={styles.modalError}>{error}</p>}
                    <div className={styles.modalActions}>
                        <button
                            type="button"
                            className={styles.cancelBtn}
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className={styles.createBtn}
                            disabled={loading}
                        >
                            {loading ? "Creating..." : "Create Assignment"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function CreateMaterialModal({ courseId, onClose, onCreated }) {
    const { createMaterial, loading, error } = useCreateMaterial(
        courseId,
        onCreated,
    );
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("");
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
        if (!title.trim()) return;
        await createMaterial(title, category, file);
    };

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h3>Add Material</h3>
                    <button className={styles.closeBtn} onClick={onClose}>
                        <X size={18} />
                    </button>
                </div>
                <form className={styles.modalForm} onSubmit={handleSubmit}>
                    <div className={styles.fieldGroup}>
                        <label htmlFor="m-title">
                            Title <span className={styles.required}>*</span>
                        </label>
                        <input
                            id="m-title"
                            className={styles.modalInput}
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. Chapter 1 Notes"
                            required
                        />
                    </div>
                    <div className={styles.fieldGroup}>
                        <label htmlFor="m-cat">
                            Category{" "}
                            <span className={styles.optional}>(optional)</span>
                        </label>
                        <input
                            id="m-cat"
                            className={styles.modalInput}
                            type="text"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            placeholder="e.g. Study Guides, Readings"
                        />
                    </div>
                    <div className={styles.fieldGroup}>
                        <label>File  <span className={styles.required}>*</span></label>
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
                            <label   className={styles.filePickerLabel}>
                                Click to attach PDF or DOCX
                                <input
                                    type="file"
                                    accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                    onChange={handleFileChange}
                                    className={styles.hiddenInput}
                                    required
                                />
                            </label>
                        )}
                        {fileError && (
                            <p className={styles.modalError}>{fileError}</p>
                        )}
                    </div>
                    {error && <p className={styles.modalError}>{error}</p>}
                    <div className={styles.modalActions}>
                        <button
                            type="button"
                            className={styles.cancelBtn}
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className={styles.createBtn}
                            disabled={loading}
                        >
                            {loading ? "Uploading..." : "Add Material"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function MaterialRow({ material, isTeacher, onDelete }) {
    const [confirmOpen, setConfirmOpen] = useState(false);

    return (
        <div className={styles.materialRow}>
            <div className={styles.materialInfo}>
                <FileUp
                    size={15}
                    strokeWidth={1.75}
                    className={styles.materialIcon}
                />
                <div>
                    <p className={styles.materialTitle}>{material.title}</p>
                    <p className={styles.materialMeta}>
                        {material.author.name} ·{" "}
                        {new Date(material.createdAt).toLocaleDateString(
                            undefined,
                            { month: "short", day: "numeric", year: "numeric" },
                        )}
                    </p>
                </div>
            </div>
            <div className={styles.materialActions}>
                {material.fileUrl && (
                    <a
                        href={material.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.viewMaterialBtn}
                    >
                        View
                    </a>
                )}
                {isTeacher && !confirmOpen && (
                    <button
                        className={styles.deleteBtn}
                        onClick={() => setConfirmOpen(true)}
                    >
                        <Trash2 size={14} strokeWidth={1.75} />
                    </button>
                )}
                {isTeacher && confirmOpen && (
                    <div className={styles.confirmRow}>
                        <span className={styles.confirmText}>Delete?</span>
                        <button
                            className={styles.confirmYes}
                            onClick={() => onDelete(material.id)}
                        >
                            Yes
                        </button>
                        <button
                            className={styles.confirmNo}
                            onClick={() => setConfirmOpen(false)}
                        >
                            No
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

function MaterialsTab({ courseId, isTeacher }) {
    const { materials, setMaterials, loading, fetchMaterials } =
        useMaterials(courseId);
    const [modalOpen, setModalOpen] = useState(false);

    useState(() => {
        fetchMaterials();
    }, []);

    const { deleteMaterial } = useDeleteMaterial(courseId, (deletedId) => {
        setMaterials((prev) => prev.filter((m) => m.id !== deletedId));
    });

    const handleCreated = (newMaterial) => {
        setMaterials((prev) => [...prev, newMaterial]);
        setModalOpen(false);
    };

    const grouped = materials.reduce((acc, m) => {
        const key = m.category?.trim() || "Other";
        if (!acc[key]) acc[key] = [];
        acc[key].push(m);
        return acc;
    }, {});

    if (loading) return <p className={styles.empty}>Loading materials...</p>;

    return (
        <div className={styles.materialsTab}>
            {isTeacher && (
                <button
                    className={styles.addAssignmentBtn}
                    onClick={() => setModalOpen(true)}
                >
                    + Add Material
                </button>
            )}
            {materials.length === 0 ? (
                <p className={styles.empty}>No materials yet.</p>
            ) : (
                Object.entries(grouped).map(([category, items]) => (
                    <div key={category} className={styles.materialGroup}>
                        <p className={styles.groupLabel}>{category}</p>
                        {items.map((m) => (
                            <MaterialRow
                                key={m.id}
                                material={m}
                                isTeacher={isTeacher}
                                onDelete={deleteMaterial}
                            />
                        ))}
                    </div>
                ))
            )}
            {modalOpen && (
                <CreateMaterialModal
                    courseId={courseId}
                    onClose={() => setModalOpen(false)}
                    onCreated={handleCreated}
                />
            )}
        </div>
    );
}

export default function Course() {
    const { course, setCourse, errors, loading } = useCourse();
    const [tab, setTab] = useState("overview");
    const [assignmentModalOpen, setAssignmentModalOpen] = useState(false);
    const { user } = useAuth();

    if (loading) return <div className="loading">Loading...</div>;
    if (errors.length > 0)
        return <div className="error">Failed to load course.</div>;

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
                                </NavLink>
                            ))
                        )}
                    </div>
                )}

                {tab === "materials" && (
                    <MaterialsTab
                        courseId={course.id}
                        isTeacher={user.role === "teacher"}
                    />
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
