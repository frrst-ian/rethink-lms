function errorHandler(err, req, res, next) {
    console.error(err);

    // Prisma errors
    if (err.code === "P2002") {
        return res.status(409).json({ error: "A record with that value already exists." });
    }

    if (err.code === "P2025") {
        return res.status(404).json({ error: "Record not found." });
    }

    // JWT errors
    if (err.name === "JsonWebTokenError") {
        return res.status(401).json({ error: "Invalid token." });
    }

    if (err.name === "TokenExpiredError") {
        return res.status(401).json({ error: "Token has expired." });
    }

    // Validation errors 
    if (err.name === "ValidationError") {
        return res.status(400).json({ error: err.message });
    }

    // Generic HTTP errors 
    const status = err.status || err.statusCode || 500;
    const message = status < 500 ? err.message : "Internal Server Error";

    return res.status(status).json({ error: message });
}

module.exports = errorHandler;