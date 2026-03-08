const prisma = require("../lib/prisma");

async function getAllSubmissions(assignId) {
    return prisma.submission.findMany({
        where: {
            assignmentId: assignId,
        },
    });
}

async function getStudentSubmission(userId, assignmentId) {
    return await prisma.submission.findFirst({
        where: {
            userId: userId,
            assignmentId: assignmentId,
        },
    });
}

async function submitAssignment(content, assignmentId, userId) {
    return await prisma.assignment.create({
        data: {
            content,
            userId,
            assignmentId,
        },
    });
}

module.exports = { getAllSubmissions, getStudentSubmission, submitAssignment };
