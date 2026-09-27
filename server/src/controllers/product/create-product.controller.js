import asyncHandler from "../../core/asyncHandler.js";
import ApiError from "../../core/ApiError.js";
import ApiResponse from "../../core/ApiResponse.js";

import { ProductModel } from "../../models/product.model.js";
import { uploadImage } from "../../integrations/media/image.provider.js";

export const createProduct = asyncHandler(async (req, res) => {
  const { name, description, price, category, stock } = req.body;

  if (!req.file) {
    throw new ApiError(400, "Product image is required.");
  }

  const imageResult = await uploadImage({
    file: req.file.buffer,
    fileName: req.file.originalname,
    folder: "/ecom/products",
  });

  const product = await ProductModel.create({
    name,
    description,
    price,
    category,
    stock,
    image: imageResult.url,
  });

  const response = new ApiResponse(
    201,
    { product },
    "Product created successfully.",
  );

  return res.status(response.statusCode).json(response);
});
