import asyncHandler from "../../core/asyncHandler.js";
import ApiError from "../../core/ApiError.js";
import ApiResponse from "../../core/ApiResponse.js";
import UserModel from "../../models/user.model.js";

import { verifPassword } from "../../utils/password.utils.js";
import {
  generateAccessToken,
  generateRefreshToken,
  hashRefreshToken,
} from "../../utils/token.utils.js";
import { cookieConfig } from "../../utils/cookie.util.js";

export const loginController = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find user
  const user = await UserModel.findOne({ email });

  if (!user) {
    throw new ApiError(401, "Invalid email or password.");
  }

  // Verify password
  const isPasswordValid = await verifPassword(password, user.passwordHash);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid email or password.");
  }

  const userId = user._id.toString();

  // Generate tokens
  const accessToken = generateAccessToken(userId);
  const refreshToken = generateRefreshToken(userId);

  // Hash refresh token before storing it
  const refreshTokenHash = hashRefreshToken(refreshToken);

  await UserModel.findByIdAndUpdate(user._id, {
    refreshTokenHash,
  });

  // Store refresh token in HTTP-only cookie
  res.cookie("refreshToken", refreshToken, cookieConfig);

  // Safe user object
  const safeUser = {
    id: user._id,
    name: user.name,
    email: user.email,
  };

  const response = new ApiResponse(
    200,
    {
      user: safeUser,
      accessToken,
    },
    "Login Successful!",
  );

  return res.status(response.statusCode).json(response);
});
