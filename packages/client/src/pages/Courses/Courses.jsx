import useCourses from "../../hooks/Courses/useCourses";
import Button from "../../components/Button/Button";
import styles from "./courses.module.css";
import { SquareLibrary, Users } from "lucide-react";
import { NavLink } from "react-router-dom";

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

export default function Courses() {
    const { courses, errors, loading } = useCourses();

    if (loading) return <div className="loading">Loading...</div>;
    if (errors.length > 0) return <div className="error">Failed to load courses.</div>;

    return (
        <div className={styles.coursesWrapper}>
            <h1>My Courses</h1>
            <div className={styles.courses}>
                {courses.length === 0
                    ? <p className={styles.empty}>No courses yet.</p>
                    : courses.map((c, i) => <CourseCard key={c.id} course={c} index={i} />)
                }
            </div>
        </div>
    );
}