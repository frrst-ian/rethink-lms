const { Router } = require("express");
const authRouter = Router();
const authController = require("../controllers/authController");
const authenticateJwt = require("../middleware/auth");
const passport = require("../config/passport");
const validate = require("../middleware/validate");
const {
    registerValidator,
    loginValidator,
} = require("../validators/userValidator");

authRouter.post(
    "/register",
    registerValidator,
    validate,
    authController.postRegister,
);
authRouter.post("/login", loginValidator, authController.postLogin);
authRouter.get(
    "/google",
    passport.authenticate("google", {
        scope: ["profile", "email"],
    }),
);
authRouter.get(
    "/google/callback",
    passport.authenticate("google", {
        failureRedirect: "/login",
        session: false,
    }),
    authController.getGoogleAuth,
);
authRouter.post("/set-role", authenticateJwt, authController.postSetRole);

module.exports = authRouter;
