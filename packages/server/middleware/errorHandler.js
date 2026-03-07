function errorHandler(err, req, res, next) {
    console.error(err);
    
    // Prisma duplicate entry error
    if (err.code === "P2002") {
        const fields = err.meta?.target || err.meta?.driverAdapterError?.cause?.constraint?.fields;
        const field = Array.isArray(fields) ? fields[0] : fields;
        const message = field
            ? `An account with that ${field} already exists.`
            : "A record with that value already exists.";
        return res.status(409).json({ errors: [message] });
    }
    
    // Prisma record not found error
    if (err.code === "P2025") {
        return res.status(404).json({ errors: ["Record not found."] });
    }
    
    // JWT errors
    if (err.name === "JsonWebTokenError") {
        return res.status(401).json({ errors: ["Invalid token."] });
    }
    
    if (err.name === "TokenExpiredError") {
        return res.status(401).json({ errors: ["Token has expired."] });
    }
    
    // Passport authentication errors
    if (err.name === "AuthenticationError") {
        return res.status(401).json({ errors: ["Incorrect email or password."] });
    }
    
    // Validation errors
    if (err.name === "ValidationError") {
        return res.status(400).json({ errors: [err.message] });
    }
    
    // Multer file upload errors
    if (err.name === "MulterError") {
        const messages = {
            LIMIT_FILE_SIZE: "File size is too large.",
            LIMIT_FILE_COUNT: "Too many files uploaded.",
            LIMIT_UNEXPECTED_FILE: "Unexpected file field.",
        };
        return res.status(400).json({ 
            errors: [messages[err.code] || "File upload error."] 
        });
    }
    
    // Generic HTTP errors
    const status = err.status || err.statusCode || 500;
    const message = status < 500 ? err.message : "Internal Server Error";
    return res.status(status).json({ errors: [message] });
}

module.exports = errorHandler;