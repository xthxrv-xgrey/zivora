import { body, validationResult } from "express-validator";
import ApiError from "../../core/ApiError.js";

export const createProductValidator = [
  body("name")
    .exists()
    .withMessage("Product name is required")
    .bail()
    .isString()
    .withMessage("Product name must be a string")
    .bail()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Product name must be between 2 and 100 characters"),

  body("description")
    .exists()
    .withMessage("Product description is required")
    .bail()
    .isString()
    .withMessage("Product description must be a string")
    .bail()
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage("Product description must be between 10 and 2000 characters"),

  body("price")
    .exists()
    .withMessage("Product price is required")
    .bail()
    .isFloat({ min: 0 })
    .withMessage("Product price must be a number greater than or equal to 0")
    .toFloat(),

  body("category")
    .exists()
    .withMessage("Product category is required")
    .bail()
    .isString()
    .withMessage("Product category must be a string")
    .bail()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Product category must be between 2 and 50 characters"),

  body("stock")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Stock must be a non-negative integer")
    .toInt(),

  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return next(new ApiError(400, "Invalid product data.", errors.array()));
    }

    next();
  },
];
