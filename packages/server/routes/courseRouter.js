const { Router } = require("express");
const courseRouter = Router();
const courseController = require("../controllers/courseController");
const materialController = require("../controllers/materialController");

const authenticateJwt = require("../middleware/auth");
const requireRole = require("../middleware/requireRole");
const {
    createCourseValidator,
    createAssignmentValidator,
} = require("../validators/courseValidator");
const validate = require("../middleware/validate");
const { upload } = require("../config/cloudinary");

courseRouter.get(
    "/",
    authenticateJwt,
    requireRole("student", "teacher"),
    courseController.getAllCourses,
);
courseRouter.get(
    "/by-code/:code",
    authenticateJwt,
    requireRole("student", "teacher"),
    courseController.getCourseByCode,
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
    createCourseValidator,
    validate,
    courseController.createCourse,
);
courseRouter.post(
    "/:id/enroll",
    authenticateJwt,
    requireRole("student"),
    courseController.enrollStudent,
);
courseRouter.get(
    "/:courseId/assignments/:id",
    authenticateJwt,
    requireRole("student", "teacher"),
    courseController.getAssignmentById,
);
courseRouter.post(
    "/:courseId/assignments",
    authenticateJwt,
    requireRole("teacher"),
    upload.single("file"),
    createAssignmentValidator,
    validate,
    courseController.createAssignment,
);
courseRouter.delete(
    "/:id",
    authenticateJwt,
    requireRole("teacher"),
    courseController.deleteCourse,
);
courseRouter.get(
    "/:courseId/materials",
    authenticateJwt,
    requireRole("student", "teacher"),
    materialController.getMaterials,
);
courseRouter.post(
    "/:courseId/materials",
    authenticateJwt,
    requireRole("teacher"),
    upload.single("file"),
    materialController.createMaterial,
);
courseRouter.delete(
    "/:courseId/materials/:id",
    authenticateJwt,
    requireRole("teacher"),
    materialController.deleteMaterial,
);

module.exports = courseRouter;
