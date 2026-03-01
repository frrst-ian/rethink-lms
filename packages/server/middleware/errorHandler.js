function errorHandler(err, req, res, next) {
    console.error(err);

    if (err.code === "P2002") {
        const fields = err.meta?.driverAdapterError?.cause?.constraint?.fields;
        const field = fields?.[0];

        const message = field
            ? `An account with that ${field} already exists.`
            : "A record with that value already exists.";

        return res.status(409).json({ error: message });
    }

    if (err.code === "P2025") {
        return res.status(404).json({ error: "Record not found." });
    }

    if (err.name === "JsonWebTokenError") {
        return res.status(401).json({ error: "Invalid token." });
    }

    if (err.name === "TokenExpiredError") {
        return res.status(401).json({ error: "Token has expired." });
    }

    if (err.name === "ValidationError") {
        return res.status(400).json({ error: err.message });
    }

    // Generic HTTP errors
    const status = err.status || err.statusCode || 500;
    const message = status < 500 ? err.message : "Internal Server Error";

    return res.status(status).json({ error: message });
}

module.exports = errorHandler;
