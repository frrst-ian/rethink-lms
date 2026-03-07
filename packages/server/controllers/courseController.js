const db = require("../db/courseModel");

async function getAllCourses(req, res) {
    const courses = await db.getAllCourses();
    return res.json(courses);
}

async function getCourseById(req, res) {
    const id = parseInt(req.params.id);

    const course = await db.getCourseById(id);
    return res.json(course);
}

async function createCourse(req, res) {
    const { title, description } = req.body;
    const id = parseInt(req.user.id);
    const newCourse = await db.createCourse(title, description, id);
    return res.status(201).json(newCourse);
}

module.exports = { getAllCourses, getCourseById, createCourse };
