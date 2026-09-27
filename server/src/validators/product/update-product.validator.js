import { body, validationResult } from "express-validator";
import ApiError from "../../core/ApiError.js";

export const updateProductValidator = [
  body("name")
    .optional()
    .isString()
    .withMessage("Product name must be a string")
    .bail()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Product name must be between 2 and 100 characters"),

  body("description")
    .optional()
    .isString()
    .withMessage("Product description must be a string")
    .bail()
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage("Product description must be between 10 and 2000 characters"),

  body("price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Product price must be a number greater than or equal to 0")
    .toFloat(),

  body("category")
    .optional()
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
