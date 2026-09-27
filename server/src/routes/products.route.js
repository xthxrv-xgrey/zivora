import { Router } from "express";

import { authenticate } from "../middlewares/auth.middleware.js";
import imageUpload from "../middlewares/image-upload.middleware.js";

import { productIdValidator } from "../validators/product/product-id.validator.js";
import { createProductValidator } from "../validators/product/create-product.validator.js";
import { updateProductValidator } from "../validators/product/update-product.validator.js";

import { createProduct } from "../controllers/product/create-product.controller.js";
import { getProduct } from "../controllers/product/get-product.controller.js";
import { getProducts } from "../controllers/product/get-products.controller.js";
import { updateProduct } from "../controllers/product/update-product.controller.js";
import { deleteProduct } from "../controllers/product/delete-product.controller.js";

const router = Router();

router.post(
  "/",
  authenticate,
  imageUpload.single("image"),
  createProductValidator,
  createProduct,
);

router.get("/", getProducts);

router.get("/:id", productIdValidator, getProduct);

router.patch(
  "/:id",
  authenticate,
  productIdValidator,
  updateProductValidator,
  updateProduct,
);

router.delete("/:id", authenticate, productIdValidator, deleteProduct);

export default router;
