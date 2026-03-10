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

async function createSuggestion(resultId, content) {
    return await prisma.suggestion.create({
        data: {
            resultId,
            content,
        },
    });
}

module.exports = { createResult, createSuggestion };
