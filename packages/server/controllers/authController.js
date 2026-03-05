const db = require("../db/authModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { uploadToCloudinary } = require("../config/cloudinary");
const passport = require("../config/passport");

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

    // issue a new token with needsOnboarding: false
    const token = jwt.sign(
        { userId: user.id, email: user.email, needsOnboarding: false },
        process.env.JWT_SECRET,
        { expiresIn: "7d" },
    );

    return res.json({ token, user });
}

module.exports = { postRegister, postLogin, getGoogleAuth, postSetRole };
