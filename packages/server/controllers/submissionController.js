const db = require("../db/submissionModel");
const { validateId, ensureExists } = require("../helpers/validators");

async function getSubmissionResults(req, res) {
    const submissionId = validateId(req.params.id, "Submission ID");

    const submissionResults = await db.getSubmissionResults(submissionId);
    ensureExists(submissionResults, " Submission Result");
    return res.json(submissionResults);
}

module.exports = { getSubmissionResults };
