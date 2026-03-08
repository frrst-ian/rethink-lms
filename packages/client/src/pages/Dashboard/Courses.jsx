import useCourses from "../../hooks/dashboard/useCourses";

export default function Courses() {
    const { courses, errors, loading } = useCourses();

    if (loading) return <div className="loading">Loading...</div>;
    if (errors.length > 0)
        return <div className="error">Failed to load courses.</div>;

    return (
        <>
            <div className="coursesWrapper">
                <h1>My Courses</h1>
                <div className="courses">
                    {courses.map((c) => (
                        <div key={c.id} className="course">
                            <p>{c.title}</p>
                            <p>{c.section}</p>
                            <div className="teacherInfo">
                                {c.createdBy.profilePicture && (
                                    <img
                                        src={c.createdBy.profilePicture}
                                        alt="pfp"
                                        width={30}
                                    />
                                )}
                                <p>{c.createdBy.name}</p>
                            </div>
                            <p>{c._count.enrollments} Students Enrolled</p>
                            <p>Invitation Code: {c.code}</p>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
