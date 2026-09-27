import { body, validationResult } from "express-validator";
import ApiError from "../../core/ApiError.js";

export const loginValidator = [
  body("email")
    .exists()
    .withMessage("Email is Required")
    .bail()
    .isString()
    .withMessage("Email must be a String Value")
    .bail()
    .trim()
    .isEmail()
    .withMessage("Enter a valid email address"),

  body("password")
    .exists()
    .withMessage("Password is required")
    .bail()
    .isString()
    .withMessage("Password must be a String value")
    .bail()
    .trim()
    .isLength({ min: 6 })
    .withMessage("Password at least 6 character long"),

  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return next(new ApiError(400, "Invalid data", errors.array()));
    }

    next();
  },
];
