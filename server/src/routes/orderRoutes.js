import express from "express";

import {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
} from "../controllers/orderController.js";

import {
  createOrderValidator,
  updateOrderStatusValidator,
  orderIdValidator,
} from "../validators/orderValidator.js";

import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";
import validate from "../middleware/validationMiddleware.js";

const router = express.Router();

/* =========================================
   ALL ORDER ROUTES REQUIRE LOGIN
========================================= */

router.use(authMiddleware);

/* =========================================
   CREATE ORDER
========================================= */

router.post(
  "/",
  createOrderValidator,
  validate,
  createOrder
);

/* =========================================
   MY ORDERS
========================================= */

router.get(
  "/my-orders",
  getMyOrders
);

/* =========================================
   GET ALL ORDERS
   Admin
========================================= */

router.get(
  "/",
  adminMiddleware,
  getAllOrders
);

/* =========================================
   GET SINGLE ORDER
========================================= */

router.get(
  "/:id",
  orderIdValidator,
  validate,
  getOrderById
);

/* =========================================
   UPDATE ORDER STATUS
   Admin
========================================= */

router.patch(
  "/:id/status",
  adminMiddleware,
  updateOrderStatusValidator,
  validate,
  updateOrderStatus
);

export default router;