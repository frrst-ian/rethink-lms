const { Router } = require("express");
const assignmentRouter = Router();
const assignmentController = require("../controllers/assignmentController");
const authenticateJwt = require("../middleware/auth");
const requireRole = require("../middleware/requireRole");

assignmentRouter.get(
    "/:id/submissions",
    authenticateJwt,
    requireRole( "teacher"),
    assignmentController.getAllSubmissions,
);
assignmentRouter.get(
    "/:id/submissions/mine",
    authenticateJwt,
    requireRole( "student"),
    assignmentController.getStudentSubmission,
);
assignmentRouter.post(
    "/:id/submissions",
    authenticateJwt,
    requireRole( "student"),
    assignmentController.submitAssignment,
);

module.exports = assignmentRouter;
