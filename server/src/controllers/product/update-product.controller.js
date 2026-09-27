import asyncHandler from "../../core/asyncHandler.js";
import ApiResponse from "../../core/ApiResponse.js";

export const updateProduct = asyncHandler(async (req, res) => {
  const product = req.product;

  const { name, description, price, category, stock } = req.body;

  if (name !== undefined) {
    product.name = name;
  }

  if (description !== undefined) {
    product.description = description;
  }

  if (price !== undefined) {
    product.price = price;
  }

  if (category !== undefined) {
    product.category = category;
  }

  if (stock !== undefined) {
    product.stock = stock;
  }

  await product.save();

  const response = new ApiResponse(
    200,
    { product },
    "Product updated successfully.",
  );

  return res.status(response.statusCode).json(response);
});
