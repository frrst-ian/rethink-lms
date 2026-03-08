const db = require("../db/assignmentModel");
const { validateId, ensureExists } = require("../helpers/validators");

async function getAllSubmissions(req, res) {
    const assignmentId = validateId(req.params.id, "Assign ID");

    const submissions = await db.getAllSubmissions(assignmentId);
    return res.json(submissions);
}

async function getStudentSubmission(req, res) {
    const userId = req.user.id;
    const assignmentId = validateId(req.params.id, "Assign ID");

    const assignment = await db.getStudentSubmission(userId, assignmentId);
    ensureExists(assignment, "Student Submission");

    return res.json(assignment);
}

async function submitAssignment(req, res) {
    const { content } = req.body;
    const userId = req.user.id;

    const assignmentId = validateId(req.params.id, "Assign ID");

    if (!content?.trim()) {
        return res.status(400).json({ errors: ["Content is required"] });
    }

    const submittedAssignment = await db.submitAssignment(
        content,
        assignmentId,
        userId,
    );

    ensureExists(submittedAssignment, "Submitted Assignment");

    return res.json(submittedAssignment);
}

module.exports = { getAllSubmissions, getStudentSubmission, submitAssignment };
