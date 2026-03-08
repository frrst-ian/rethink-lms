const { Router } = require("express");
const submissionRouter = Router();
const submissionController = require("../controllers/submissionController");
const authenticateJwt = require("../middleware/auth");
const requireRole = require("../middleware/requireRole");

submissionRouter.get(
    "/:id/result",
    authenticateJwt,
    requireRole("student", "teacher"),
    submissionController.getSubmissionResults,
);

module.exports = submissionRouter;
