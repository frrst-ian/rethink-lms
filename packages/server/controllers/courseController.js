const db = require("../db/courseModel");
const { validateId, ensureExists } = require("../helpers/validators");

async function getAllCourses(req, res) {
    const courses = await db.getAllCourses();
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
        return res.status(400).json({ error: "Title is required" });
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
            .json({ error: "Already enrolled in this course" });
    }

    await db.enrollStudent(userId, courseId);

    return res.status(201).json({
        message: "Successfully enrolled in course",
        courseId,
        userId,
    });
}

module.exports = { getAllCourses, getCourseById, createCourse, enrollStudent };
