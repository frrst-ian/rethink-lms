const { Router } = require("express");
const assignmentRouter = Router();
const assignmentController = require("../controllers/assignmentController");
const authenticateJwt = require("../middleware/auth");
const requireRole = require("../middleware/requireRole");
const { upload } = require("../config/cloudinary");

assignmentRouter.get(
    "/:id/submissions",
    authenticateJwt,
    requireRole("teacher"),
    assignmentController.getAllSubmissions,
);
assignmentRouter.get(
    "/:id/submissions/mine",
    authenticateJwt,
    requireRole("student"),
    assignmentController.getStudentSubmission,
);
assignmentRouter.post(
    "/:id/submissions",
    authenticateJwt,
    requireRole("student"),
    upload.single("file"),
    assignmentController.submitAssignment,
);
assignmentRouter.delete(
    "/:id/submissions/reset",
    authenticateJwt,
    requireRole("teacher"),
    assignmentController.resetSubmission,
);
assignmentRouter.get(
    "/:id",
    authenticateJwt,
    requireRole("student", "teacher"),
    assignmentController.getAssignment,
);

module.exports = assignmentRouter;
