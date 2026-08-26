import express from "express";

import {
  getProductReviews,
  createReview,
  updateReview,
  deleteReview,
} from "../controllers/reviewController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

/* =========================================
   GET PRODUCT REVIEWS
   Public
========================================= */

router.get(
  "/product/:productId",
  getProductReviews
);

/* =========================================
   CREATE REVIEW
   Login required
========================================= */

router.post(
  "/product/:productId",
  authMiddleware,
  createReview
);

/* =========================================
   UPDATE REVIEW
========================================= */

router.put(
  "/:reviewId",
  authMiddleware,
  updateReview
);

/* =========================================
   DELETE REVIEW
========================================= */

router.delete(
  "/:reviewId",
  authMiddleware,
  deleteReview
);

export default router;