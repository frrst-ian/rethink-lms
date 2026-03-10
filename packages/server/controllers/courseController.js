const { uploadToCloudinary } = require("../config/cloudinary");
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

    const userId = req.user.id;
    const newCourse = await db.createCourse(title, section, code, userId);

    return res.status(201).json(newCourse);
}

async function getCourseByCode(req, res) {
    const { code } = req.params;
    const course = await db.getCourseByCode(code);
    ensureExists(course, "Course");
    return res.json(course);
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
    let fileUrl = null;
    let fileType = null;

    if (req.file) {
        const result = await uploadToCloudinary(
            req.file.buffer,
            req.file.mimetype,
        );
        fileUrl = result.secure_url;
        fileType = result.fileType;
    }

    const { title, description, dueDate } = req.body;

    const courseId = validateId(req.params.courseId, "Course ID");

    const userId = req.user.id;

    const newAssignment = await db.createAssignment(
        title,
        description,
        dueDate,
        courseId,
        userId,
        fileUrl,
        fileType,
    );
    return res.status(201).json(newAssignment);
}

async function deleteCourse(req, res) {
    const id = validateId(req.params.id, "Course Id");

    const course = await db.getCourseById(id);

    ensureExists(course, "Course");

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
    getCourseByCode,
};
