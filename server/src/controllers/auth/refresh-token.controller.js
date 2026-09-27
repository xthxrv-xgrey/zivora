import ApiError from "../../core/ApiError.js";
import ApiResponse from "../../core/ApiResponse.js";
import asyncHandler from "../../core/asyncHandler.js";
import UserModel from "../../models/user.model.js";
import { cookieConfig } from "../../utils/cookie.util.js";
import {
  generateAccessToken,
  generateRefreshToken,
  hashRefreshToken,
  verifyRefreshToken,
} from "../../utils/token.utils.js";

export const refreshTokenController = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    throw new ApiError(401, "Refresh token is required.");
  }

  let decoded;

  try {
    decoded = verifyRefreshToken(refreshToken);
  } catch {
    throw new ApiError(401, "Invalid or expired refresh token.");
  }

  const user = await UserModel.findById(decoded.userId);

  if (!user) {
    throw new ApiError(401, "User not found.");
  }

  // Hash the provided refresh token and compare it
  const refreshTokenHash = hashRefreshToken(refreshToken);

  if (!user.refreshTokenHash || user.refreshTokenHash !== refreshTokenHash) {
    throw new ApiError(401, "Invalid refresh token.");
  }

  const userId = user._id.toString();

  // Rotate refresh token
  const newAccessToken = generateAccessToken(userId);

  const newRefreshToken = generateRefreshToken(userId);

  const newRefreshTokenHash = hashRefreshToken(newRefreshToken);

  await UserModel.findByIdAndUpdate(user._id, {
    refreshTokenHash: newRefreshTokenHash,
  });

  // Replace old refresh token
  res.cookie("refreshToken", newRefreshToken, cookieConfig);

  const response = new ApiResponse(
    200,
    {
      accessToken: newAccessToken,
    },
    "Access token refreshed successfully.",
  );

  return res.status(response.statusCode).json(response);
});
