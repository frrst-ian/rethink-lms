const db = require("../db/courseModel");

async function getAllCourses(req, res) {
    const courses = await db.getAllCourses();
    return res.json(courses);
}

async function getCourseById(req, res) {}

module.exports = { getAllCourses, getCourseById };
