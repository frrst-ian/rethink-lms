const db = require("../db/assignmentModel");
const resultModel = require("../db/resultModel");
const notificationModel = require("../db/notificationModel");
const prisma = require("../lib/prisma");
const { uploadToCloudinary } = require("../config/cloudinary");
const extractText = require("../helpers/extractText");
const generateSuggestion = require("../helpers/generateSuggestion");
const { validateId, ensureExists } = require("../helpers/validators");
const detectAI = require("../helpers/detectAI");

async function getAllSubmissions(req, res) {
    const assignmentId = validateId(req.params.id, "Assignment ID");

    const assignment = await db.getAssignmentById(assignmentId);
    ensureExists(assignment, "Assignment");

    if (assignment.userId !== req.user.id) {
        return res.status(403).json({ errors: ["Forbidden"] });
    }

    const submissions = await db.getAllSubmissions(assignmentId);
    return res.json(submissions);
}

async function getStudentSubmission(req, res) {
    const userId = req.user.id;
    const assignmentId = validateId(req.params.id, "Assignment ID");

    const assignment = await db.getAssignmentById(assignmentId);
    ensureExists(assignment, "Assignment");

    const enrolled = await prisma.enrollment.findUnique({
        where: { userId_courseId: { userId, courseId: assignment.courseId } },
    });
    if (!enrolled) {
        return res.status(403).json({ errors: ["You are not enrolled in this course."] });
    }

    const submission = await db.getStudentSubmission(userId, assignmentId);
    ensureExists(submission, "Student Submission");
    return res.json(submission);
}

async function getAssignment(req, res) {
    const id = validateId(req.params.id, "Assignment ID");
    const assignment = await db.getAssignmentById(id);
    ensureExists(assignment, "Assignment");
    return res.json(assignment);
}

async function getAllAssignments(req, res) {
    const userId = req.user.id;
    const role = req.user.role;

    if (role === "teacher") {
        const assignments = await prisma.assignment.findMany({
            where: { userId },
            include: {
                course: { select: { id: true, title: true, section: true } },
                _count: { select: { submissions: true } },
            },
            orderBy: { dueDate: "asc" },
        });
        return res.json(assignments);
    }

    const enrollments = await prisma.enrollment.findMany({
        where: { userId },
        select: { courseId: true },
    });
    const courseIds = enrollments.map((e) => e.courseId);

    const assignments = await prisma.assignment.findMany({
        where: { courseId: { in: courseIds } },
        include: {
            course: { select: { id: true, title: true, section: true } },
            submissions: {
                where: { userId },
                select: { id: true, submittedAt: true, result: { select: { ai_percentage: true, isFlagged: true } } },
            },
        },
        orderBy: { dueDate: "asc" },
    });
    return res.json(assignments);
}

async function submitAssignment(req, res) {
    let fileUrl = null;
    let fileType = null;
    let originalName = null;

    if (req.file) {
        const result = await uploadToCloudinary(
            req.file.buffer,
            req.file.mimetype,
            req.file.originalname,
        );
        fileUrl = result.secure_url;
        fileType = result.fileType;
        originalName = req.file.originalname.replace(/\.[^.]+$/, "");
    }

    const { content } = req.body;
    const userId = req.user.id;
    const assignmentId = validateId(req.params.id, "Assignment ID");

    const assignment = await db.getAssignmentById(assignmentId);
    ensureExists(assignment, "Assignment");

    const enrolled = await prisma.enrollment.findUnique({
        where: { userId_courseId: { userId, courseId: assignment.courseId } },
    });
    if (!enrolled) {
        return res.status(403).json({ errors: ["You are not enrolled in this course."] });
    }

    const existingSubmission = await db.getStudentSubmission(userId, assignmentId);
    if (existingSubmission) {
        return res.status(409).json({ errors: ["Assignment submission already exists."] });
    }

    const submission = await db.submitAssignment(
        content, assignmentId, userId, fileUrl, fileType, originalName,
    );
    ensureExists(submission, "Submitted Assignment");

    const student = await prisma.user.findUnique({
        where: { id: userId },
        select: { name: true },
    });

    await notificationModel.createNotification(
        assignment.userId,
        `${student.name} submitted "${assignment.title}"`,
        `/courses/${assignment.courseId}/assignments/${assignmentId}`,
    );

    let textContent = content;
    if (!textContent && fileUrl && fileType) {
        textContent = await extractText(fileUrl, fileType);
    }

    const detection = await detectAI(textContent);

    if (!detection.skipped) {
        const aiPercentageFormatted = parseFloat((detection.ai_percentage * 100).toFixed(2));
        const humanPercentageFormatted = parseFloat(((1 - detection.ai_percentage) * 100).toFixed(2));

        const result = await resultModel.createResult(
            submission.id, aiPercentageFormatted, detection.isFlagged,
        );

        if (detection.isFlagged) {
            const suggestionText = await generateSuggestion(textContent);
            await resultModel.createSuggestion(result.id, suggestionText);

            await notificationModel.createNotification(
                assignment.userId,
                `${student.name}'s submission for "${assignment.title}" was flagged as AI-generated`,
                `/courses/${assignment.courseId}/assignments/${assignmentId}`,
            );
        }

        return res.status(201).json({
            submission,
            ai_percentage: aiPercentageFormatted,
            human_percentage: humanPercentageFormatted,
            isFlagged: detection.isFlagged,
        });
    }

    return res.status(201).json({ submission, skipped: true, reason: detection.reason });
}

async function resetSubmission(req, res) {
    const assignmentId = validateId(req.params.id, "Assignment ID");
    const { studentId } = req.body;

    const assignment = await db.getAssignmentById(assignmentId);
    ensureExists(assignment, "Assignment");

    if (assignment.userId !== req.user.id) {
        return res.status(403).json({ errors: ["Forbidden"] });
    }

    const parsedStudentId = validateId(studentId, "Student ID");
    const submission = await db.getStudentSubmission(parsedStudentId, assignmentId);
    ensureExists(submission, "Submission");

    await db.deleteSubmission(submission.id);
    return res.json({ message: "Submission reset. Student can resubmit." });
}

module.exports = {
    getAllSubmissions,
    getStudentSubmission,
    submitAssignment,
    resetSubmission,
    getAssignment,
    getAllAssignments,
};