import asyncHandler from "../../core/asyncHandler.js";
import ApiError from "../../core/ApiError.js";
import ApiResponse from "../../core/ApiResponse.js";
import UserModel from "../../models/user.model.js";
import { cookieConfig } from "../../utils/cookie.util.js";

export const logoutController = asyncHandler(async (req, res) => {
  const user = req.user;

  if (!user) {
    throw new ApiError(401, "Unauthorized.");
  }

  // Remove stored refresh token
  await UserModel.findByIdAndUpdate(user._id, {
    $unset: {
      refreshTokenHash: 1,
    },
  });

  // Clear refresh token cookie
  res.clearCookie("refreshToken", cookieConfig);

  const response = new ApiResponse(200, null, "Logout Successful!");

  return res.status(response.statusCode).json(response);
});
