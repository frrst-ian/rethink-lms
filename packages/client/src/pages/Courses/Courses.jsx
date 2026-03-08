import useCourses from "../../hooks/dashboard/useCourses";
import Button from "../../components/Button/Button";
import styles from "./courses.module.css";
import { SquareLibrary } from "lucide-react";
import { NavLink } from "react-router-dom";

export default function Courses() {
    const { courses, errors, loading } = useCourses();

    if (loading) return <div className="loading">Loading...</div>;
    if (errors.length > 0)
        return <div className="error">Failed to load courses.</div>;

    return (
        <>
            <div className={styles.coursesWrapper}>
                <h1>My Courses</h1>
                <div className={styles.courses}>
                    {courses.map((c) => (
                        <div key={c.id} className={styles.course}>
                            <p className={styles.title}>{c.title}</p>
                            <div className={styles.section}>
                                <SquareLibrary />
                                <p>{c.section}</p>
                            </div>
                            <div className={styles.teacherInfo}>
                                {c.createdBy.profilePicture && (
                                    <img
                                        src={c.createdBy.profilePicture}
                                        alt="pfp"
                                        width={30}
                                    />
                                )}
                                <p>{c.createdBy.name}</p>
                            </div>
                            <NavLink to={`/courses/${c.id}`}>
                                <Button type="viewBtn" label="View Course" />
                            </NavLink>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
