const { Router } = require("express");
const courseRouter = Router();
const {
    getAllCourses,
    getCourseById,
} = require("../controllers/courseController");
const authenticateJwt = require("../middleware/auth");
const requireRole = require("../middleware/requireRole");

courseRouter.get(
    "/",
    authenticateJwt,
    requireRole("student", "teacher"),
    getAllCourses,
);
courseRouter.get(
    "/:id",
    authenticateJwt,
    requireRole("student", "teacher"),
    getCourseById,
);

module.exports = courseRouter;
