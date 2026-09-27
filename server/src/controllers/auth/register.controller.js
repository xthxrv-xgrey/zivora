import asyncHandler from "../../core/asyncHandler.js";
import ApiError from "../../core/ApiError.js";
import ApiResponse from "../../core/ApiResponse.js";
import UserModel from "../../models/user.model.js";
import { hashPassword } from "../../utils/password.utils.js";

export const registerController = asyncHandler(async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  // Check password confirmation
  if (password !== confirmPassword) {
    throw new ApiError(400, "Passwords do not match.");
  }

  // Check if user already exists
  const existingUser = await UserModel.findOne({ email });

  if (existingUser) {
    throw new ApiError(409, "User already exists.");
  }

  // Hash password
  const passwordHash = await hashPassword(password);

  // Create user
  const user = await UserModel.create({
    name,
    email,
    passwordHash,
  });

  // Remove sensitive fields from response
  const safeUser = {
    id: user._id,
    name: user.name,
    email: user.email,
  };

  const response = new ApiResponse(
    201,
    { user: safeUser },
    "Registration Successful!",
  );

  return res.status(response.statusCode).json(response);
});
