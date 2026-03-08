import { useState } from "react";
import useCourses from "../../hooks/Courses/useCourses";
import useCreateCourse from "../../hooks/Courses/useCreateCourse";
import useEnroll from "../../hooks/Courses/useEnroll";
import Button from "../../components/Button/Button";
import styles from "./courses.module.css";
import { SquareLibrary, Users, X } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function CourseCard({ course: c, index }) {
    return (
        <div className={styles.course} style={{ animationDelay: `${index * 60}ms` }}>
            <p className={styles.title}>{c.title}</p>
            {c.section && (
                <div className={styles.section}>
                    <SquareLibrary size={20} />
                    <p>{c.section}</p>
                </div>
            )}
            <div className={styles.teacherInfo}>
                {c.createdBy.profilePicture && (
                    <img src={c.createdBy.profilePicture} alt="pfp" width={22} />
                )}
                <p>{c.createdBy.name}</p>
            </div>
            <div className={styles.enrolled}>
                <Users size={20} />
                <p>{c._count.enrollments} enrolled</p>
            </div>
            <div className={styles.code}>Code: <span>{c.code}</span></div>
            <NavLink to={`/courses/${c.id}`}>
                <Button type="viewBtn" label="View Course" />
            </NavLink>
        </div>
    );
}

function CreateCourseModal({ onClose, onCreated }) {
    const { createCourse, loading, error } = useCreateCourse(onCreated);
    const [title, setTitle] = useState("");
    const [section, setSection] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim()) return;
        await createCourse(title, section);
    };

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h3>Create New Course</h3>
                    <button className={styles.closeBtn} onClick={onClose}>
                        <X size={18} />
                    </button>
                </div>
                <form className={styles.modalForm} onSubmit={handleSubmit}>
                    <div className={styles.fieldGroup}>
                        <label htmlFor="title">Course Title <span className={styles.required}>*</span></label>
                        <input
                            id="title"
                            className={styles.modalInput}
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. Introduction to Biology"
                            required
                        />
                    </div>
                    <div className={styles.fieldGroup}>
                        <label htmlFor="section">Section <span className={styles.optional}>(optional)</span></label>
                        <input
                            id="section"
                            className={styles.modalInput}
                            type="text"
                            value={section}
                            onChange={(e) => setSection(e.target.value)}
                            placeholder="e.g. Section A"
                        />
                    </div>
                    {error && <p className={styles.modalError}>{error}</p>}
                    <div className={styles.modalActions}>
                        <button type="button" className={styles.cancelBtn} onClick={onClose}>Cancel</button>
                        <button type="submit" className={styles.createBtn} disabled={loading}>
                            {loading ? "Creating..." : "Create Course"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function EnrollModal({ onClose, onEnrolled }) {
    const { enroll, loading, error } = useEnroll(onEnrolled);
    const [code, setCode] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!code.trim()) return;
        await enroll(code);
    };

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h3>Join a Course</h3>
                    <button className={styles.closeBtn} onClick={onClose}>
                        <X size={18} />
                    </button>
                </div>
                <form className={styles.modalForm} onSubmit={handleSubmit}>
                    <div className={styles.fieldGroup}>
                        <label htmlFor="code">Course Code <span className={styles.required}>*</span></label>
                        <input
                            id="code"
                            className={`${styles.modalInput} ${styles.codeInput}`}
                            type="text"
                            value={code}
                            onChange={(e) => setCode(e.target.value.toUpperCase())}
                            placeholder="e.g. A1B2C3"
                            maxLength={6}
                            required
                        />
                        <p className={styles.hint}>Ask your teacher for the course code.</p>
                    </div>
                    {error && <p className={styles.modalError}>{error}</p>}
                    <div className={styles.modalActions}>
                        <button type="button" className={styles.cancelBtn} onClick={onClose}>Cancel</button>
                        <button type="submit" className={styles.createBtn} disabled={loading}>
                            {loading ? "Joining..." : "Join Course"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function Courses() {
    const { courses, setCourses, errors, loading } = useCourses();
    const { user } = useAuth();
    const [createOpen, setCreateOpen] = useState(false);
    const [enrollOpen, setEnrollOpen] = useState(false);

    const handleCourseCreated = (newCourse) => {
        setCourses((prev) => [newCourse, ...prev]);
        setCreateOpen(false);
    };

    const handleEnrolled = (newCourse) => {
        setCourses((prev) => [newCourse, ...prev]);
        setEnrollOpen(false);
    };

    if (loading) return <div className="loading">Loading...</div>;
    if (errors.length > 0) return <div className="error">Failed to load courses.</div>;

    return (
        <div className={styles.coursesWrapper}>
            <div className={styles.pageHeader}>
                <h1>My Courses</h1>
                {user?.role === "teacher" && (
                    <button className={styles.createCourseBtn} onClick={() => setCreateOpen(true)}>
                        + New Course
                    </button>
                )}
                {user?.role === "student" && (
                    <button className={styles.createCourseBtn} onClick={() => setEnrollOpen(true)}>
                        + Join Course
                    </button>
                )}
            </div>

            <div className={styles.courses}>
                {courses.length === 0
                    ? <p className={styles.empty}>
                        {user?.role === "student"
                            ? `You haven't joined any courses yet. Click "+ Join Course" to get started.`
                            : "No courses yet."}
                      </p>
                    : courses.map((c, i) => <CourseCard key={c.id} course={c} index={i} />)
                }
            </div>

            {createOpen && (
                <CreateCourseModal
                    onClose={() => setCreateOpen(false)}
                    onCreated={handleCourseCreated}
                />
            )}
            {enrollOpen && (
                <EnrollModal
                    onClose={() => setEnrollOpen(false)}
                    onEnrolled={handleEnrolled}
                />
            )}
        </div>
    );
}