const db = require("../db/dashboardModel");

async function getTeacherDashboard(req, res) {
    const data = await db.getTeacherDashboard(req.user.id);
    return res.json(data);
}

async function getStudentDashboard(req, res) {
    const data = await db.getStudentDashboard(req.user.id);
    return res.json(data);
}

module.exports = { getTeacherDashboard, getStudentDashboard };