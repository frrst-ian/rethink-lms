function validateId(id, fieldName = "ID") {
    const parsed = parseInt(id);

    if (isNaN(parsed) || parsed <= 0) {
        const error = new Error(`Invalid ${fieldName}`);
        error.status = 400;
        throw error;
    }

    return parsed;
}

function ensureExists(record, resourceName = "Resource") {
    if (!record) {
        const error = new Error(`${resourceName} not found`);
        error.status = 404;
        throw error;
    }
}

module.exports = { validateId, ensureExists };
