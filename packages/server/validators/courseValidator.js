const { body } = require("express-validator");

const createCourseValidator = [
    body("title")
        .trim()
        .notEmpty()
        .withMessage("Title is required")
        .isLength({ max: 100 })
        .withMessage("Title must be under 100 characters"),

    body("section")
        .optional()
        .trim()
        .isLength({ max: 50 })
        .withMessage("Section must be under 50 characters"),
];

const createAssignmentValidator = [
    body("title")
        .trim()
        .notEmpty()
        .withMessage("Title is required")
        .isLength({ max: 100 })
        .withMessage("Title must be under 100 characters"),
    body("description")
        .trim()
        .notEmpty()
        .withMessage("Description is required")
        .isLength({ max: 500 })
        .withMessage("Description must be under 500 characters"),
    body("dueDate")
        .notEmpty()
        .withMessage("Due date is required")
        .isISO8601()
        .withMessage("Due date must be a valid date"),
];

module.exports = {
    createCourseValidator,
    createAssignmentValidator
};
