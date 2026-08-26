import User from "../models/User.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import Category from "../models/Category.js";

import { successResponse, errorResponse } from "../utils/apiResponse.js";

import { sendOrderStatusEmail } from "../services/emailService.js";

/* =========================================
   ADMIN DASHBOARD
   GET /api/admin/dashboard
========================================= */

export const getDashboardStats = async (req, res, next) => {
  try {
    /* =========================================
       TOTAL COUNTS
    ========================================= */

    const [totalUsers, totalProducts, totalOrders, totalCategories] =
      await Promise.all([
        User.countDocuments(),

        Product.countDocuments({
          isActive: true,
        }),

        Order.countDocuments(),

        Category.countDocuments({
          isActive: true,
        }),
      ]);

    /* =========================================
       ORDER STATUS COUNTS
    ========================================= */

    const [
      processingOrders,
      confirmedOrders,
      shippedOrders,
      deliveredOrders,
      cancelledOrders,
    ] = await Promise.all([
      Order.countDocuments({
        orderStatus: "Processing",
      }),

      Order.countDocuments({
        orderStatus: "Confirmed",
      }),

      Order.countDocuments({
        orderStatus: "Shipped",
      }),

      Order.countDocuments({
        orderStatus: "Delivered",
      }),

      Order.countDocuments({
        orderStatus: "Cancelled",
      }),
    ]);

    /* =========================================
       REVENUE
    ========================================= */

    const revenueResult = await Order.aggregate([
      {
        $match: {
          orderStatus: {
            $ne: "Cancelled",
          },

          paymentStatus: {
            $in: ["Paid"],
          },
        },
      },

      {
        $group: {
          _id: null,

          totalRevenue: {
            $sum: "$totalPrice",
          },
        },
      },
    ]);

    const totalRevenue =
      revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    /* =========================================
       RECENT ORDERS
    ========================================= */

    const recentOrders = await Order.find()
      .populate("user", "name email")
      .sort({
        createdAt: -1,
      })
      .limit(5)
      .select("_id user totalPrice orderStatus paymentStatus createdAt");

    /* =========================================
       RESPONSE
    ========================================= */

    return successResponse(
      res,
      200,
      "Dashboard statistics retrieved successfully.",
      {
        overview: {
          totalUsers,
          totalProducts,
          totalOrders,
          totalCategories,
          totalRevenue,
        },

        orders: {
          processing: processingOrders,
          confirmed: confirmedOrders,
          shipped: shippedOrders,
          delivered: deliveredOrders,
          cancelled: cancelledOrders,
        },

        recentOrders,
      },
    );
  } catch (error) {
    next(error);
  }
};

/* =========================================
   GET ALL USERS
   GET /api/admin/users
========================================= */

export const getAllUsers = async (req, res, next) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);

    const limit = Math.min(Number(req.query.limit) || 10, 100);

    const skip = (page - 1) * limit;

    const search = req.query.search?.trim();

    /* =========================================
       SEARCH FILTER
    ========================================= */

    const filter = {};

    if (search) {
      filter.$or = [
        {
          name: {
            $regex: search,
            $options: "i",
          },
        },

        {
          email: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    /* =========================================
       USERS
    ========================================= */

    const [users, totalUsers] = await Promise.all([
      User.find(filter)
        .select("-password -resetPasswordToken -resetPasswordExpire")
        .sort({
          createdAt: -1,
        })
        .skip(skip)
        .limit(limit),

      User.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalUsers / limit);

    return successResponse(res, 200, "Users retrieved successfully.", {
      users,

      pagination: {
        currentPage: page,
        totalPages,
        totalUsers,
        limit,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    });
  } catch (error) {
    next(error);
  }
};

/* =========================================
   GET SINGLE USER
   GET /api/admin/users/:id
========================================= */

export const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select(
      "-password -resetPasswordToken -resetPasswordExpire",
    );

    if (!user) {
      return errorResponse(res, 404, "User not found.");
    }

    return successResponse(res, 200, "User retrieved successfully.", user);
  } catch (error) {
    next(error);
  }
};

/* =========================================
   UPDATE USER ROLE
   PATCH /api/admin/users/:id/role
========================================= */

export const updateUserRole = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { role } = req.body;

    /* =========================================
       VALID ROLE
    ========================================= */

    if (!["user", "admin"].includes(role)) {
      return errorResponse(
        res,
        400,
        "Invalid role. Role must be user or admin.",
      );
    }

    /* =========================================
       PREVENT SELF ROLE CHANGE
    ========================================= */

    if (req.user.id?.toString() === id.toString()) {
      return errorResponse(res, 400, "You cannot change your own admin role.");
    }

    const user = await User.findById(id);

    if (!user) {
      return errorResponse(res, 404, "User not found.");
    }

    user.role = role;

    await user.save();

    const userResponse = await User.findById(id).select(
      "-password -resetPasswordToken -resetPasswordExpire",
    );

    return successResponse(
      res,
      200,
      `User role updated to ${role}.`,
      userResponse,
    );
  } catch (error) {
    next(error);
  }
};

/* =========================================
   UPDATE USER STATUS
   PATCH /api/admin/users/:id/status
========================================= */

export const updateUserStatus = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { isActive } = req.body;

    /* =========================================
       VALIDATE BOOLEAN
    ========================================= */

    if (typeof isActive !== "boolean") {
      return errorResponse(res, 400, "isActive must be true or false.");
    }

    /* =========================================
       PREVENT SELF DEACTIVATION
    ========================================= */

    if (req.user.id?.toString() === id.toString()) {
      return errorResponse(res, 400, "You cannot deactivate your own account.");
    }

    const user = await User.findById(id);

    if (!user) {
      return errorResponse(res, 404, "User not found.");
    }

    user.isActive = isActive;

    await user.save();

    return successResponse(
      res,
      200,
      isActive
        ? "User account activated successfully."
        : "User account deactivated successfully.",
    );
  } catch (error) {
    next(error);
  }
};

/* =========================================
   DELETE USER
   DELETE /api/admin/users/:id
========================================= */

export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    /* =========================================
       PREVENT SELF DELETE
    ========================================= */

    if (req.user.id?.toString() === id.toString()) {
      return errorResponse(
        res,
        400,
        "You cannot delete your own admin account.",
      );
    }

    const user = await User.findById(id);

    if (!user) {
      return errorResponse(res, 404, "User not found.");
    }

    await User.findByIdAndDelete(id);

    return successResponse(res, 200, "User deleted successfully.");
  } catch (error) {
    next(error);
  }
};

/* =========================================
   GET LOW STOCK PRODUCTS
   GET /api/admin/products/low-stock
========================================= */

export const getLowStockProducts = async (req, res, next) => {
  try {
    const threshold = Math.min(
      Math.max(Number(req.query.threshold) || 5, 0),
      100,
    );

    const products = await Product.find({
  isActive: true,
  stock: {
    $lte: threshold,
  },
})
      .select("name price stock images brand category")
      .populate("category", "name")
      .sort({
        stock: 1,
      });

    return successResponse(
      res,
      200,
      "Low stock products retrieved successfully.",
      {
        threshold,
        count: products.length,
        products,
      },
    );
  } catch (error) {
    next(error);
  }
};

/* =========================================
   GET RECENT USERS
   GET /api/admin/users/recent
========================================= */

export const getRecentUsers = async (req, res, next) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 5, 50);

    const users = await User.find()
      .select("name email role isActive avatar createdAt")
      .sort({
        createdAt: -1,
      })
      .limit(limit);

    return successResponse(
      res,
      200,
      "Recent users retrieved successfully.",
      users,
    );
  } catch (error) {
    next(error);
  }
};
