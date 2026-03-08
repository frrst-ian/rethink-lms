const db = require("../db/authModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { createAvatar } = require("@dicebear/core");
const { initials } = require("@dicebear/collection");

function signToken(user, extra = {}) {
    return jwt.sign(
        {
            userId: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            profilePicture: user.profilePicture,
            needsOnboarding: false,
            ...extra,
        },
        process.env.JWT_SECRET,
        { expiresIn: "14d" },
    );
}

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

    const token = signToken(user);

    return res.status(201).json({ token, user });
}

async function postLogin(req, res) {
    const user = req.user;
    const token = signToken(user);

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
        const token = signToken(req.user, { needsOnboarding: !req.user.role });

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

    const token = signToken(user);

    return res.json({ token, user });
}

module.exports = { postRegister, postLogin, getGoogleAuth, postSetRole };
