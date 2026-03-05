const { Router } = require("express");
const courseRouter = Router();
const { getAllCourses } = require("../controllers/courseController");
const authenticateJwt = require("../middleware/auth");
const requireRole = require("../middleware/requireRole");

courseRouter.get("/", authenticateJwt, requireRole("student", "teacher"), getAllCourses);

module.exports = courseRouter;
