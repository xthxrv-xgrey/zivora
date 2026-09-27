import asyncHandler from "../../core/asyncHandler.js";
import ApiResponse from "../../core/ApiResponse.js";
import { ProductModel } from "../../models/product.model.js";

export const getProducts = asyncHandler(async (req, res) => {
  const products = await ProductModel.find();

  const response = new ApiResponse(
    200,
    { products },
    "Products fetched successfully.",
  );

  return res.status(response.statusCode).json(response);
});
