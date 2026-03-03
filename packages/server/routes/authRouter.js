const { Router } = require("express");
const authRouter = Router();
const authController = require("../controllers/authController");
const { upload } = require("../config/cloudinary");
const passport = require("../config/passport")
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
authRouter.get("/google", passport.authenticate("google", { 
    scope: ["profile", "email"] 
}));
authRouter.get("/google/callback", authController.getGoogleAuth);
authRouter.post("/set-role", authenticateJwt, authController.postSetRole);

module.exports = authRouter;
