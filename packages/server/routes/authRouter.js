const { Router } = require("express");
const authRouter = Router();
const authController = require("../controllers/authController");
const { upload } = require("../config/cloudinary");
const validate = require("../middleware/validate");
const {
    registerValidator,
    loginValidator,
} = require("../validators/userValidator");

authRouter.post(
    "/register",
    upload.single("profilePicture"),
    registerValidator,
    validate,
    authController.postRegister,
);
authRouter.post("/login", loginValidator, authController.postLogin);

authRouter.get(
    "/google",
    passport.authenticate("google", {
        failureRedirect: "/login",
        session: false,
    }),
    (req, res) => {
        try {
            const token = jwt.sign(
                { userId: req.user.id, email: req.user.email },
                process.env.JWT_SECRET,
                { expiresIn: "7d" },
            );

            res.redirect(`https://localhost:5172/auth/callback?token=${token}`);
        } catch (err) {
            console.error("JWT generation error:", err);
            res.status(500).json({ message: "Failed to generate token" });
        }
    },
);

module.exports = authRouter;
