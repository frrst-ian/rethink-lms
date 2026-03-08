const db = require("../db/authModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { createAvatar } = require("@dicebear/core");
const { initials } = require("@dicebear/collection");

async function postRegister(req, res) {
    const { name, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 12);

    const avatar = createAvatar(initials, {
        seed: name,
        size: 200,
        backgroundColor: [
            "00897b",
            "ffb300",
            "5e35b1",
            "1e88e5",
            "d81b60",
            "8e24aa",
        ],
        backgroundType: ["solid", "gradientLinear"],
    });

    const profilePicture = avatar.toDataUri();

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

async function postLogin(req, res) {
    const user = req.user;

    const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "7d" },
    );

    return res.json({
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            profilePicture: user.profilePicture,
        },
    });
}

async function getGoogleAuth(req, res) {
    try {
        const token = jwt.sign(
            {
                userId: req.user.id,
                email: req.user.email,
                needsOnboarding: !req.user.role,
            },
            process.env.JWT_SECRET,
            { expiresIn: "7d" },
        );
        res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${token}`);
    } catch (err) {
        res.redirect("/login");
    }
}
async function postSetRole(req, res) {
    const { role } = req.body;

    if (!["student", "teacher"].includes(role)) {
        return res.status(400).json({ error: "Invalid role" });
    }

    const user = await db.updateUserRole(req.user.id, role);

    const token = jwt.sign(
        {
            userId: user.id,
            email: user.email,
            name: req.user.name,
            role: req.user.role,
            profilePicture: req.user.profilePicture,
            needsOnboarding: false,
        },
        process.env.JWT_SECRET,
        { expiresIn: "7d" },
    );

    return res.json({ token, user });
}

module.exports = { postRegister, postLogin, getGoogleAuth, postSetRole };
