import express from "express";

import {
  getDashboardStats,

  // Users
  getAllUsers,
  getUserById,
  updateUserRole,
  updateUserStatus,
  deleteUser,
  getRecentUsers,

  // Products
  getLowStockProducts,
} from "../controllers/adminController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

/* =========================================
   ADMIN PROTECTION
========================================= */

router.use(authMiddleware);
router.use(adminMiddleware);

/* =========================================
   DASHBOARD
========================================= */

router.get("/dashboard", getDashboardStats);

/* =========================================
   USERS
========================================= */

router.get("/users", getAllUsers);

router.get("/users/recent", getRecentUsers);

router.get("/users/:id", getUserById);

router.patch("/users/:id/role", updateUserRole);

router.patch("/users/:id/status", updateUserStatus);

router.delete("/users/:id", deleteUser);

/* =========================================
   PRODUCTS
========================================= */

router.get("/products/low-stock", getLowStockProducts);

export default router;