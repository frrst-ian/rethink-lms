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

module.exports = { getAllCourses, getCourseById };
