import ApiError from "./ApiError.js";

const errorHandler = (error, _req, res, _next) => {
  if (error instanceof ApiError) {
    return res.status(error.statusCode).json({
      success: false,
      statusCode: error.statusCode,
      message: error.message,
      errors: error.errors,
    });
  }

  console.error(error);

  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
};

export default errorHandler;
