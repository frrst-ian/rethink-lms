const prisma = require("../lib/prisma");

async function getSubmissionResults(submissionId) {
    return prisma.submission.findUnique({
        where: {
            id: submissionId,
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

module.exports = { getSubmissionResults };
