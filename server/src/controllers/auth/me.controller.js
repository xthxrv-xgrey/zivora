import ApiError from "../../core/ApiError.js";
import ApiResponse from "../../core/ApiResponse.js";
import asyncHandler from "../../core/asyncHandler.js";

export const meController = asyncHandler(async (req, res) => {
  const user = req.user;

  if (!user) {
    throw new ApiError(401, "Unauthorized.");
  }

  const safeUser = {
    id: user._id,
    name: user.name,
    email: user.email,
  };

  const response = new ApiResponse(
    200,
    {
      user: safeUser,
    },
    "User fetched successfully.",
  );

  return res.status(response.statusCode).json(response);
});
