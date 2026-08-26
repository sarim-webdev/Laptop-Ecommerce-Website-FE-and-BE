import mongoose from "mongoose";

import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

import { successResponse, errorResponse } from "../utils/apiResponse.js";

import {
  sendOrderConfirmationEmail,
  sendOrderStatusEmail,
} from "../services/emailService.js";

/* =========================================
   CREATE ORDER
   POST /api/orders
   AUTHENTICATED USER
========================================= */

export const createOrder = async (req, res, next) => {
  const session = await mongoose.startSession();

  try {
    const { orderItems, shippingAddress, paymentMethod } = req.body;

    /* =========================================
       USER
    ========================================= */

    const userId = req.user.id || req.user._id || req.user.userId;

    if (!userId) {
      return errorResponse(
        res,
        401,
        "User authentication information is missing.",
      );
    }

    /* =========================================
       BASIC ORDER VALIDATION
    ========================================= */

    if (!Array.isArray(orderItems) || orderItems.length === 0) {
      return errorResponse(
        res,
        400,
        "Order must contain at least one product.",
      );
    }

    if (!shippingAddress) {
      return errorResponse(res, 400, "Shipping address is required.");
    }

    if (
      !shippingAddress.fullName?.trim() ||
      !shippingAddress.phone?.trim() ||
      !shippingAddress.address?.trim() ||
      !shippingAddress.city?.trim() ||
      !shippingAddress.country?.trim()
    ) {
      return errorResponse(res, 400, "Complete shipping address is required.");
    }

    if (!["COD", "ONLINE"].includes(paymentMethod)) {
      return errorResponse(res, 400, "Invalid payment method.");
    }

    /* =========================================
       START TRANSACTION
    ========================================= */

    session.startTransaction();

    const productIds = orderItems.map((item) => item.product);

    /* =========================================
       FETCH PRODUCTS
    ========================================= */

    const products = await Product.find({
      _id: {
        $in: productIds,
      },
      isActive: true,
    }).session(session);

    /* =========================================
       CHECK ALL PRODUCTS EXIST
    ========================================= */

    if (products.length !== new Set(productIds.map(String)).size) {
      await session.abortTransaction();

      return errorResponse(
        res,
        404,
        "One or more products could not be found.",
      );
    }

    /* =========================================
       CREATE PRODUCT MAP
    ========================================= */

    const productMap = new Map();

    products.forEach((product) => {
      productMap.set(product._id.toString(), product);
    });

    /* =========================================
       CALCULATE ORDER ITEMS
    ========================================= */

    const finalOrderItems = [];

    let itemsPrice = 0;

    for (const item of orderItems) {
      const product = productMap.get(item.product.toString());

      if (!product) {
        await session.abortTransaction();

        return errorResponse(res, 404, `Product ${item.product} not found.`);
      }

      const quantity = Number(item.quantity);

      if (!Number.isInteger(quantity) || quantity < 1) {
        await session.abortTransaction();

        return errorResponse(
          res,
          400,
          `Invalid quantity for ${product.name}. Quantity must be a positive integer.`,
        );
      }

      /* =========================================
         STOCK CHECK
      ========================================= */

      if (product.stock < quantity) {
        await session.abortTransaction();

        return errorResponse(
          res,
          400,
          `Insufficient stock for ${product.name}. Available stock: ${product.stock}.`,
        );
      }

      /* =========================================
         CURRENT DATABASE PRICE
         NEVER TRUST FRONTEND PRICE
      ========================================= */

      const price = Number(product.price);

      const subtotal = price * quantity;

      itemsPrice += subtotal;

      /* =========================================
         ORDER ITEM SNAPSHOT
      ========================================= */

      finalOrderItems.push({
        product: product._id,
        name: product.name,
        image: product.images?.[0]?.url || "",
        price,
        quantity,
        subtotal,
      });

      /* =========================================
         REDUCE STOCK
      ========================================= */

      product.stock -= quantity;

      await product.save({
        session,
      });
    }

    /* =========================================
       SHIPPING PRICE
    ========================================= */

    /*
      Example business rule:

      Free shipping for orders
      above $500.

      Otherwise $15.
    */

    const shippingPrice = itemsPrice >= 100000 ? 0 : 1500;

    /* =========================================
       TAX
    ========================================= */

    /*
      Example tax:
      5%

      Change this according
      to your business requirements.
    */

    const taxPrice = Number((itemsPrice * 0.05).toFixed(2));

    /* =========================================
       TOTAL PRICE
    ========================================= */

    const totalPrice = Number(
      (itemsPrice + shippingPrice + taxPrice).toFixed(2),
    );

    /* =========================================
       PAYMENT STATUS
    ========================================= */

    /*
      COD:
      Payment remains Pending.

      ONLINE:
      Payment remains Pending until
      payment gateway confirms it.
    */

    const paymentStatus = "Pending";

    /* =========================================
       CREATE ORDER
    ========================================= */

    const order = new Order({
      user: userId,

      orderItems: finalOrderItems,

      shippingAddress: {
        fullName: shippingAddress.fullName.trim(),

        phone: shippingAddress.phone.trim(),

        address: shippingAddress.address.trim(),

        city: shippingAddress.city.trim(),

        state: shippingAddress.state?.trim() || "",

        postalCode: shippingAddress.postalCode?.trim() || "",

        country: shippingAddress.country.trim(),
      },

      paymentMethod,

      paymentStatus,

      orderStatus: "Processing",

      itemsPrice,

      shippingPrice,

      taxPrice,

      totalPrice,

      paymentTransactionId: null,

      paidAt: null,

      deliveredAt: null,

      cancelledAt: null,
    });

    await order.save({
      session,
    });

    /* =========================================
   CLEAR USER CART
========================================= */

    await Cart.findOneAndUpdate(
      {
        user: userId,
      },
      {
        $set: {
          items: [],
          totalAmount: 0,
        },
      },
      {
        session,
      },
    );

    /* =========================================
   COMMIT TRANSACTION
========================================= */

    await session.commitTransaction();

    /* =========================================
       SEND CONFIRMATION EMAIL
    ========================================= */

    /*
      Email failure should NOT
      cancel an already-created order.
    */

    try {
      if (req.user.email) {
        await sendOrderConfirmationEmail({
          userEmail: req.user.email,

          userName: req.user.name || shippingAddress.fullName,

          orderId: order._id.toString(),

          totalAmount: totalPrice,
        });
      }
    } catch (emailError) {
      console.error("Order confirmation email failed:", emailError.message);
    }

    /* =========================================
       RESPONSE
    ========================================= */

    return successResponse(res, 201, "Order created successfully.", order);
  } catch (error) {
    /* =========================================
       ABORT TRANSACTION
    ========================================= */

    try {
      await session.abortTransaction();
    } catch (abortError) {
      console.error("Transaction abort failed:", abortError.message);
    }

    next(error);
  } finally {
    session.endSession();
  }
};

/* =========================================
   GET MY ORDERS
   GET /api/orders/my-orders
   AUTHENTICATED USER
========================================= */

export const getMyOrders = async (req, res, next) => {
  try {
    const userId = req.user.id || req.user._id || req.user.userId;

    if (!userId) {
      return errorResponse(
        res,
        401,
        "User authentication information is missing.",
      );
    }

    /* =========================================
         PAGINATION
      ========================================= */

    const page = Math.max(Number(req.query.page) || 1, 1);

    const limit = Math.min(Number(req.query.limit) || 10, 50);

    const skip = (page - 1) * limit;

    /* =========================================
         FETCH ORDERS
      ========================================= */

    const [orders, totalOrders] = await Promise.all([
      Order.find({
        user: userId,
      })
        .populate("orderItems.product", "name images price")
        .sort({
          createdAt: -1,
        })
        .skip(skip)
        .limit(limit),

      Order.countDocuments({
        user: userId,
      }),
    ]);

    const totalPages = Math.ceil(totalOrders / limit);

    return successResponse(res, 200, "Your orders retrieved successfully.", {
      orders,

      pagination: {
        currentPage: page,
        totalPages,
        totalOrders,
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
   GET SINGLE ORDER
   GET /api/orders/:id
   AUTHENTICATED USER
========================================= */

export const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const userId = req.user.id || req.user._id || req.user.userId;

    /* =========================================
         FIND ORDER
      ========================================= */

    const order = await Order.findById(id)
      .populate("user", "name email phone")
      .populate("orderItems.product", "name images price stock");

    if (!order) {
      return errorResponse(res, 404, "Order not found.");
    }

    /* =========================================
         CHECK OWNERSHIP
      ========================================= */

    const isOwner = order.user._id.toString() === userId.toString();

    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return errorResponse(
        res,
        403,
        "You are not authorized to view this order.",
      );
    }

    /* =========================================
         RESPONSE
      ========================================= */

    return successResponse(res, 200, "Order retrieved successfully.", order);
  } catch (error) {
    next(error);
  }
};

/* =========================================
   GET ALL ORDERS
   GET /api/orders
   ADMIN ONLY
========================================= */

export const getAllOrders = async (req, res, next) => {
  try {
    /* =========================================
         PAGINATION
      ========================================= */

    const page = Math.max(Number(req.query.page) || 1, 1);

    const limit = Math.min(Number(req.query.limit) || 20, 100);

    const skip = (page - 1) * limit;

    /* =========================================
         FILTER
      ========================================= */

    const filter = {};

    if (req.query.status) {
      filter.orderStatus = req.query.status;
    }

    if (req.query.paymentStatus) {
      filter.paymentStatus = req.query.paymentStatus;
    }

    if (req.query.paymentMethod) {
      filter.paymentMethod = req.query.paymentMethod;
    }

    /* =========================================
         FETCH ORDERS
      ========================================= */

    const [orders, totalOrders] = await Promise.all([
      Order.find(filter)
        .populate("user", "name email phone avatar")
        .populate("orderItems.product", "name images price")
        .sort({
          createdAt: -1,
        })
        .skip(skip)
        .limit(limit),

      Order.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalOrders / limit);

    return successResponse(res, 200, "All orders retrieved successfully.", {
      orders,

      pagination: {
        currentPage: page,
        totalPages,
        totalOrders,
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
   UPDATE ORDER STATUS
   PATCH /api/orders/:id/status
   ADMIN ONLY
========================================= */

export const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { orderStatus } = req.body;

    /* =========================================
       VALID STATUSES
    ========================================= */

    const allowedStatuses = [
      "Processing",
      "Confirmed",
      "Shipped",
      "Delivered",
      "Cancelled",
    ];

    if (!allowedStatuses.includes(orderStatus)) {
      return errorResponse(res, 400, "Invalid order status.");
    }

    /* =========================================
       FIND ORDER
    ========================================= */

    const order = await Order.findById(id)
      .populate("user", "name email");

    if (!order) {
      return errorResponse(res, 404, "Order not found.");
    }

    /* =========================================
       PREVENT SAME STATUS UPDATE
    ========================================= */

    if (order.orderStatus === orderStatus) {
      return errorResponse(
        res,
        400,
        `Order is already ${orderStatus}.`
      );
    }

    /* =========================================
       PREVENT UPDATING CANCELLED ORDER
    ========================================= */

    if (order.orderStatus === "Cancelled") {
      return errorResponse(
        res,
        400,
        "A cancelled order cannot be moved to another status."
      );
    }

    /* =========================================
       PREVENT UPDATING DELIVERED ORDER
    ========================================= */

    if (
      order.orderStatus === "Delivered" &&
      orderStatus !== "Delivered"
    ) {
      return errorResponse(
        res,
        400,
        "A delivered order cannot be moved to another status."
      );
    }

    /* =========================================
       CANCEL ORDER
    ========================================= */

    if (orderStatus === "Cancelled") {

      for (const item of order.orderItems) {

        const updatedProduct =
          await Product.findByIdAndUpdate(
            item.product,
            {
              $inc: {
                stock: item.quantity,
              },
            },
            {
              new: true,
            }
          );

        if (!updatedProduct) {
          return errorResponse(
            res,
            404,
            `Product for order item ${item.product} not found.`
          );
        }
      }

      order.cancelledAt = new Date();
    }

    /* =========================================
       DELIVERED
    ========================================= */

    if (orderStatus === "Delivered") {

      order.deliveredAt = new Date();

      if (
        order.paymentMethod === "COD" &&
        order.paymentStatus === "Pending"
      ) {
        order.paymentStatus = "Paid";
        order.paidAt = new Date();
      }
    }

    /* =========================================
       UPDATE STATUS
    ========================================= */

    order.orderStatus = orderStatus;

    await order.save();

    /* =========================================
       SEND STATUS EMAIL
    ========================================= */

    try {
      if (order.user?.email) {
        await sendOrderStatusEmail({
          userEmail: order.user.email,

          userName:
            order.user.name || "Customer",

          orderId:
            order._id.toString(),

          status: orderStatus,
        });
      }
    } catch (emailError) {
      console.error(
        "Order status email failed:",
        emailError.message
      );
    }

    /* =========================================
       RESPONSE
    ========================================= */

    return successResponse(
      res,
      200,
      "Order status updated successfully.",
      order
    );

  } catch (error) {
    next(error);
  }
};
