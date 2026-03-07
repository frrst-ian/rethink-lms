const db = require("../db/authModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("../config/passport");
const { createAvatar } = require("@dicebear/core");
const { initials, thumbs, shapes } = require("@dicebear/collection");

async function postRegister(req, res) {
    const { name, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 12);

    const avatar = createAvatar(initials, {
        seed: email,
        size: 200,
        backgroundColor: ["b6e3f4", "c0aede", "d1d4f9", "ffd5dc", "ffdfbf"],
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
    passport.authenticate("local", { session: false }, (err, user, info) => {
        if (err) {
            console.error(err);
            return res
                .status(500)
                .json({ errors: "Incorrect email or password" });
        }

        if (!user) {
            return res
                .status(401)
                .json({ errors: "Incorrect email or password" });
        }

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
    })(req, res);
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

    if (!["STUDENT", "TEACHER"].includes(role)) {
        return res.status(400).json({ error: "Invalid role" });
    }

    const user = await db.updateUserRole(req.user.id, role);

    const token = jwt.sign(
        { userId: user.id, email: user.email, needsOnboarding: false },
        process.env.JWT_SECRET,
        { expiresIn: "7d" },
    );

    return res.json({ token, user });
}

module.exports = { postRegister, postLogin, getGoogleAuth, postSetRole };
