const { Router } = require("express");
const authRouter = Router();
const authController = require("../controllers/authController");
const upload = require("../config/cloudinary");
const {
    registerValidator,
    loginValidator,
} = require("../validators/userValidator");

authRouter.post(
    "/register",
    upload.single("profilePicture"),
    registerValidator,
    authController.postRegister,
);
authRouter.post("/login", authController.postLogin);

module.exports = authRouter;
