const { Router } = require("express");
const courseRouter = Router();
const courseController = require("../controllers/courseController");
const authenticateJwt = require("../middleware/auth");
const requireRole = require("../middleware/requireRole");

courseRouter.get(
    "/",
    authenticateJwt,
    requireRole("student", "teacher"),
    courseController.getAllCourses,
);
courseRouter.get(
    "/:id",
    authenticateJwt,
    requireRole("student", "teacher"),
    courseController.getCourseById,
);
courseRouter.post(
    "/",
    authenticateJwt,
    requireRole("teacher"),
    courseController.createCourse,
);

module.exports = courseRouter;
