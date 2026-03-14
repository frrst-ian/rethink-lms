const { Router } = require("express");
const dashboardRouter = Router();
const dashboardController = require("../controllers/dashboardController");
const authenticateJwt = require("../middleware/auth");
const requireRole = require("../middleware/requireRole");

dashboardRouter.get(
    "/teacher",
    authenticateJwt,
    requireRole("teacher"),
    dashboardController.getTeacherDashboard,
);

dashboardRouter.get(
    "/student",
    authenticateJwt,
    requireRole("student"),
    dashboardController.getStudentDashboard,
);

module.exports = dashboardRouter;