import express from "express";

import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from "../controllers/cartController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

/* =========================================
   ALL CART ROUTES REQUIRE LOGIN
========================================= */

router.use(authMiddleware);

/* =========================================
   GET CART
========================================= */

router.get(
  "/",
  getCart
);

/* =========================================
   ADD TO CART
========================================= */

router.post(
  "/",
  addToCart
);

/* =========================================
   UPDATE CART ITEM
========================================= */

router.put(
  "/:productId",
  updateCartItem
);

/* =========================================
   REMOVE CART ITEM
========================================= */

router.delete(
  "/:productId",
  removeFromCart
);

/* =========================================
   CLEAR CART
========================================= */

router.delete(
  "/",
  clearCart
);

export default router;