const db = require("../db/authModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

async function postRegister(req, res) {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            const messages = errors.array().map((err) => err.msg);
            return res.status(400).json({ errors: messages });
        }

        const { name, email, password, role } = req.body;

        const hashedPassword = await bcrypt.hash(password, 12);

        console.log("req.file.secure_url: ", req.file.secure_url);
        console.log("req.file.path:", req.file.path);
        const profilePicture = req.file.secure_url || req.file.path;

        const user = await db.createUser(
            name,
            email,
            hashedPassword,
            role,
            profilePicture,
        );

        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "14d" },
        );

        return res.status(201).json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                profilePicture: user.profilePicture,
            },
        });
    } catch (err) {
        if (err.code === "P2002") {
            return res.status(400).json({
                errors: ["Email already exist"],
            });
        }
        console.error("Sign up error:", err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

async function postLogin(req, res) {
    try {
    } catch (err) {}
}

module.exports = { postRegister, postLogin };
