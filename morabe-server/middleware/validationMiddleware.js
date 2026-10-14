const { body, validationResult } = require("express-validator");

const registerValidation = [
  body("firstName")
    .trim()
    .isString()
    .isLength({ min: 2 })
    .withMessage("First name must be at least 2 characters long"),

  body("lastName")
    .trim()
    .isString()
    .isLength({ min: 2 })
    .withMessage("Last name must be at least 2 characters long"),

  body("email").trim().isEmail().withMessage("Enter a valid email address"),

  body("password")
    .isString()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

const loginValidation = [
  body("email").trim().isEmail().withMessage("Enter a valid email address"),

  body("password").isString().notEmpty().withMessage("Password is required"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = { registerValidation, loginValidation };
