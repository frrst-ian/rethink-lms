const db = require("../db/authModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { uploadToCloudinary } = require("../config/cloudinary");

async function postRegister(req, res) {
    const { name, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 12);

    let profilePicture = null;
    if (req.file) {
        const result = await uploadToCloudinary(
            req.file.buffer,
            req.file.mimetype,
        );
        profilePicture = result.secure_url;
    }

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

    return res.status(201).json({ token, user });
}

async function postLogin(req, res) {}

module.exports = { postRegister, postLogin };
