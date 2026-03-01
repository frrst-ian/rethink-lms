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
authRouter.post("/login", authController.postLogin);

module.exports = authRouter;
