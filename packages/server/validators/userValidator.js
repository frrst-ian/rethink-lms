const { body } = require("express-validator");

const registerValidator = [
    body("name")
        .notEmpty()
        .withMessage("Name is required")
        .isLength({ min: 3, max: 32 })
        .withMessage("Name must at least be 3 characters"),

    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .normalizeEmail()
        .withMessage("Must be a valid email")
        .isLength({ max: 32 })
        .withMessage("Email must be under 32 characters"),

    body("password")
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 1, max: 64 })
        .withMessage("Password must be under 64 characters"),

    body("confirmPassword")
        .notEmpty()
        .withMessage("Confirm your password")
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error("Passwords do not match");
            }
            return true;
        }),
];

const loginValidator = [
    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .normalizeEmail()
        .withMessage("Must be a valid email")
        .isLength({ max: 32 })
        .withMessage("Email must be under 32 characters"),

    body("password")
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 1, max: 64 })
        .withMessage("Password must be under 64 characters"),
];

module.exports = {
    registerValidator,
    loginValidator,
};