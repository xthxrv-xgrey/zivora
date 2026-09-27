import asyncHandler from "../../core/asyncHandler.js";
import ApiResponse from "../../core/ApiResponse.js";
import { ProductModel } from "../../models/product.model.js";

export const deleteProduct = asyncHandler(async (req, res) => {
  const product = req.product;

  await ProductModel.findByIdAndDelete(product._id);

  const response = new ApiResponse(200, null, "Product deleted successfully.");

  return res.status(response.statusCode).json(response);
});
