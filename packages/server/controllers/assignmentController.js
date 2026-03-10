const db = require("../db/assignmentModel");
const resultModel = require("../db/resultModel");
const { uploadToCloudinary } = require("../config/cloudinary");

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
    let fileUrl = null;
    let fileType = null;

    if (req.file) {
        const result = await uploadToCloudinary(
            req.file.buffer,
            req.file.mimetype,
        );
        fileUrl = result.secure_url;
        fileType = result.fileType;
    }

    const { content } = req.body;
    const userId = req.user.id;

    const assignmentId = validateId(req.params.id, "Assignment ID");

    const existingAssignmentSubmission = await db.getStudentSubmission(
        userId,
        assignmentId,
    );

    if (existingAssignmentSubmission) {
        return res
            .status(409)
            .json({ errors: ["Assignment submission already exist"] });
    }

    const submission = await db.submitAssignment(
        content,
        assignmentId,
        userId,
        fileUrl,
        fileType,
    );

    ensureExists(submission, "Submitted Assignment");

    const { ai_percentage, isFlagged } = await detectAI(content);

    const aiPercentageFormatted = parseFloat((ai_percentage * 100).toFixed(2));
    const humanPercentageFormatted = parseFloat(
        ((1 - ai_percentage) * 100).toFixed(2),
    );

    await resultModel.createResult(
        submission.id,
        aiPercentageFormatted,
        isFlagged,
    );

    return res.status(201).json({
        submission,
        ai_percentage: aiPercentageFormatted,
        human_percentage: humanPercentageFormatted,
        isFlagged,
    });
}

module.exports = {
    getAllSubmissions,
    getStudentSubmission,
    submitAssignment,
};
