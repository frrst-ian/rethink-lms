const db = require("../db/authModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

async function postRegister(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array().map(e => e.msg) });
    }

    const { name, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 12);
    const profilePicture = req.file?.secure_url || null;

    const user = await db.createUser(name, email, hashedPassword, role, profilePicture);

    const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "14d" }
    );

    return res.status(201).json({ token, user });
}

async function postLogin(req, res) {
 
}

module.exports = { postRegister, postLogin };
