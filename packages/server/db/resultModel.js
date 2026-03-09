const prisma = require("../lib/prisma");

async function createResult(submissionId, ai_percentage, isFlagged) {
    return await prisma.result.create({
        data: {
            submissionId,
            ai_percentage,
            isFlagged,
        },
    });
}

module.exports = { createResult };
