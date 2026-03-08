const db = require("../db/assignmentModel");
const { validateId, ensureExists } = require("../helpers/validators");
const detectAI = require("../helpers/detectAI");

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

    const submission = await db.submitAssignment(content, assignmentId, userId);

    ensureExists(submission, "Submitted Assignment");

    const { ai_percentage, isFlagged } = await detectAI(content);

    const formatted = parseFloat((ai_percentage * 100).toFixed(2));

    await db.createResult(submission.id, formatted, isFlagged);

    return res.status(201).json({
        submission,
        ai_percentage: formatted,
        human_percentage: parseFloat(((1 - ai_percentage) * 100).toFixed(2)),
        isFlagged,
    });
}

module.exports = {
    getAllSubmissions,
    getStudentSubmission,
    submitAssignment,
};
