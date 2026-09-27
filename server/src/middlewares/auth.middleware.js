import asyncHandler from "../core/asyncHandler.js";
import ApiError from "../core/ApiError.js";
import UserModel from "../models/user.model.js";
import { verifyAccessToken } from "../utils/token.utils.js";

export const authenticate = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new ApiError(401, "Access token is required.");
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    throw new ApiError(401, "Access token is required.");
  }

  let decoded;

  try {
    decoded = verifyAccessToken(token);
  } catch {
    throw new ApiError(401, "Invalid or expired access token.");
  }

  const user = await UserModel.findById(decoded.userId);

  if (!user) {
    throw new ApiError(401, "User not found.");
  }

  req.user = user;

  next();
});
