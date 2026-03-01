const { Router } = require("express");
const authRouter = Router();
const authController = require("../controllers/authController");
const {
    registerValidator,
    loginValidator,
} = require("../validators/userValidator");

authRouter.post("/register", registerValidator, authController.postRegister);
authRouter.post("/login", authController.postLogin);

module.exports = authRouter;
