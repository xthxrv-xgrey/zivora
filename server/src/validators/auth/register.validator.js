import { body, validationResult } from "express-validator";
import ApiError from "../../core/ApiError.js";

export const registerValidator = [
  body("name")
    .exists()
    .withMessage("Name is required")
    .bail()
    .isString()
    .withMessage("Name must be a String")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Name length must be between 2 to 50 characters"),

  body("email")
    .exists()
    .withMessage("Email is required")
    .bail()
    .trim()
    .isEmail()
    .withMessage("Enter valid email address"),

  body("password")
    .exists()
    .withMessage("Password is Required")
    .bail()
    .isString()
    .withMessage("Password must be a String")
    .trim()
    .isLength({ min: 6 })
    .withMessage("Password must be minimum 6 character long"),

  body("confirmPassword")
    .exists()
    .withMessage("Password is Required")
    .bail()
    .isString()
    .withMessage("Password must be a String")
    .trim()
    .isLength({ min: 6 })
    .withMessage("Password must be minimum 6 character long"),

  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return next(new ApiError(400, "Invalid Request", errors.array()));
    }

    next();
  },
];
