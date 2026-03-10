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

async function submitAssignment(
    content,
    assignmentId,
    userId,
    fileUrl,
    fileType,
) {
    return await prisma.submission.create({
        data: {
            content,
            userId,
            assignmentId,
            fileUrl,
            fileType,
        },
    });
}

module.exports = {
    getAllSubmissions,
    getStudentSubmission,
    submitAssignment,
};
