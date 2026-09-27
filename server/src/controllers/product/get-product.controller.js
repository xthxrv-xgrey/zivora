import ApiResponse from "../../core/ApiResponse.js";

export const getProduct = (req, res) => {
  const product = req.product;

  const response = new ApiResponse(
    200,
    { product },
    "Product fetched successfully.",
  );

  return res.status(response.statusCode).json(response);
};
