const prisma = require("../lib/prisma");

async function getAllSubmissions(assignId) {
    return prisma.submission.findMany({
        where: {
            assignmentId: assignId,
        },
        include: {
            result: {
                include: {
                    suggestion: true,
                },
            },
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    profilePicture: true,
                },
            },
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

async function deleteSubmission(id) {
    return await prisma.submission.delete({
        where: { id },
    });
}

async function getAssignmentById(id) {
    return await prisma.assignment.findUnique({
        where: { id },
        select: {
            id: true,
            title: true,
            description: true,
            dueDate: true,
            fileUrl: true,
            fileType: true,
        }
    });
}

module.exports = {
    getAllSubmissions,
    getStudentSubmission,
    submitAssignment,
    deleteSubmission,
    getAssignmentById
};
