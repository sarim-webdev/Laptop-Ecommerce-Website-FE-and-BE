import express from "express";

import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

import {
  createProductValidator,
  updateProductValidator,
  productIdValidator,
  productQueryValidator,
} from "../validators/productValidator.js";

import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";
import validate from "../middleware/validationMiddleware.js";

const router = express.Router();

/* =========================================
   GET ALL PRODUCTS
   Public
========================================= */

router.get(
  "/",
  productQueryValidator,
  validate,
  getProducts
);

/* =========================================
   GET SINGLE PRODUCT
   Public
========================================= */

router.get(
  "/:id",
  productIdValidator,
  validate,
  getProductById
);

/* =========================================
   CREATE PRODUCT
   Admin only
========================================= */

router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  upload.array("images", 5),
  createProductValidator,
  validate,
  createProduct
);

/* =========================================
   UPDATE PRODUCT
   Admin only
========================================= */

router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  upload.array("images", 5),
  updateProductValidator,
  validate,
  updateProduct
);

/* =========================================
   DELETE PRODUCT
   Admin only
========================================= */

router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  productIdValidator,
  validate,
  deleteProduct
);

export default router;