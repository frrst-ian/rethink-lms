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
        include: {
            result: {
                include: {
                    suggestion: true,
                },
            },
        },
    });
}

async function submitAssignment(content, assignmentId, userId) {
    return await prisma.submission.create({
        data: {
            content,
            userId,
            assignmentId,
        },
    });
}

async function createResult(submissionId, ai_percentage, isFlagged) {
    return await prisma.result.create({
        data: {
            submissionId,
            ai_percentage,
            isFlagged,
        },
    });
}

module.exports = {
    getAllSubmissions,
    getStudentSubmission,
    submitAssignment,
    createResult,
};
