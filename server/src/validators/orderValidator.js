import { body, param } from "express-validator";

/* =========================================
   CREATE ORDER VALIDATOR
========================================= */

export const createOrderValidator = [
  body("orderItems")
    .isArray({ min: 1 })
    .withMessage("Order must contain at least one product"),

  body("orderItems.*.product")
    .notEmpty()
    .withMessage("Product ID is required")
    .isMongoId()
    .withMessage("Invalid product ID"),

  body("orderItems.*.quantity")
    .isInt({ min: 1 })
    .withMessage("Quantity must be at least 1")
    .toInt(),

  body("shippingAddress")
    .isObject()
    .withMessage("Shipping address is required"),

  body("shippingAddress.fullName")
    .trim()
    .notEmpty()
    .withMessage("Full name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Full name must be between 2 and 100 characters"),

  body("shippingAddress.phone")
    .trim()
    .notEmpty()
    .withMessage("Phone number is required")
    .isLength({ min: 7, max: 20 })
    .withMessage("Please provide a valid phone number"),

  body("shippingAddress.address")
    .trim()
    .notEmpty()
    .withMessage("Address is required")
    .isLength({ min: 5, max: 300 })
    .withMessage("Address must be between 5 and 300 characters"),

  body("shippingAddress.city")
    .trim()
    .notEmpty()
    .withMessage("City is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("City must be between 2 and 100 characters"),

  body("shippingAddress.state")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("State name cannot exceed 100 characters"),

  body("shippingAddress.postalCode")
    .optional()
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage("Please provide a valid postal code"),

  body("shippingAddress.country")
    .trim()
    .notEmpty()
    .withMessage("Country is required"),

  body("paymentMethod")
    .trim()
    .notEmpty()
    .withMessage("Payment method is required")
    .isIn(["COD", "ONLINE"])
    .withMessage("Invalid payment method"),
];

/* =========================================
   UPDATE ORDER STATUS VALIDATOR
========================================= */

export const updateOrderStatusValidator = [
  param("id")
    .isMongoId()
    .withMessage("Invalid order ID"),

  body("orderStatus")
    .trim()
    .notEmpty()
    .withMessage("Order status is required")
    .isIn([
      "Processing",
      "Confirmed",
      "Shipped",
      "Delivered",
      "Cancelled",
    ])
    .withMessage("Invalid order status"),
];

/* =========================================
   ORDER ID VALIDATOR
========================================= */

export const orderIdValidator = [
  param("id")
    .isMongoId()
    .withMessage("Invalid order ID"),
];