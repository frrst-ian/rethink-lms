const db = require("../db/courseModel");
const { validateId, ensureExists } = require("../helpers/validators");

async function getAllCourses(req, res) {
    const { id, role } = req.user;
    const courses = await db.getAllCourses(id, role);
    return res.json(courses);
}

async function getCourseById(req, res) {
    const id = validateId(req.params.id, "Course ID");
    const course = await db.getCourseById(id);

    ensureExists(course, "Course");

    return res.json(course);
}

async function createCourse(req, res) {
    const { title, section } = req.body;

    const code = Math.random().toString(36).substring(2, 8).toUpperCase();

    if (!title?.trim()) {
        return res.status(400).json({ errors: ["Title is required"] });
    }

    const userId = req.user.id;
    const newCourse = await db.createCourse(
        title.trim(),
        section,
        code,
        userId,
    );

    return res.status(201).json(newCourse);
}

async function enrollStudent(req, res) {
    const userId = req.user.id;
    const courseId = validateId(req.params.id, "Course ID");

    const course = await db.getCourseById(courseId);
    ensureExists(course, "Course");

    const existingEnrollment = await db.checkEnrollment(userId, courseId);
    if (existingEnrollment) {
        return res
            .status(409)
            .json({ errors: ["Already enrolled in this course"] });
    }

    await db.enrollStudent(userId, courseId);

    return res.status(201).json({
        message: "Successfully enrolled in course",
        courseId,
        userId,
    });
}

async function getAssignmentById(req, res) {
    const courseId = validateId(req.params.courseId, "Course ID");

    const id = validateId(req.params.id, "ID");

    const assignment = await db.getAssignmentById(courseId, id);

    ensureExists(assignment, "Assignment");

    return res.json(assignment);
}

async function createAssignment(req, res) {
    const { title, description, dueDate } = req.body;
    const courseId = validateId(req.params.courseId, "Course ID");

    const userId = req.user.id;

    if (!title?.trim()) {
        return res.status(400).json({ errors: ["Title is required"] });
    }

    if (!description?.trim()) {
        return res.status(400).json({ errors: ["Description is required"] });
    }

    const newAssignment = await db.createAssignment(
        title.trim(),
        description.trim(),
        dueDate,
        courseId,
        userId,
    );
    return res.status(201).json(newAssignment);
}

async function deleteCourse(req, res) {
    const id = validateId(req.params.id, "Course Id");

    const course = await db.getCourseById(id);

    if (!course) {
        return res.status(404).json({ errors: ["Course doesn't exist"] });
    }

    await db.deleteCourse(id);

    return res.json({ message: "Course deleted successfully" });
}

module.exports = {
    getAllCourses,
    getCourseById,
    createCourse,
    enrollStudent,
    getAssignmentById,
    createAssignment,
    deleteCourse,
};
