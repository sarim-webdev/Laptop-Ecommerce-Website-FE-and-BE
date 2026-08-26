import { body } from "express-validator";

/* =========================================
   REGISTER VALIDATOR
========================================= */

export const registerValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail(),

  body("phone")
    .trim()
    .notEmpty()
    .withMessage("Phone number is required")
    .isLength({ min: 7, max: 20 })
    .withMessage("Please provide a valid phone number"),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8, max: 100 })
    .withMessage(
      "Password must be between 8 and 100 characters"
    ),

  body("confirmPassword")
    .notEmpty()
    .withMessage("Please confirm your password")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }

      return true;
    }),

  body("address")
    .trim()
    .notEmpty()
    .withMessage("Address is required")
    .isLength({ max: 300 })
    .withMessage("Address cannot exceed 300 characters"),

  body("city")
    .trim()
    .notEmpty()
    .withMessage("City is required")
    .isLength({ max: 100 })
    .withMessage("City cannot exceed 100 characters"),

  body("state")
    .trim()
    .notEmpty()
    .withMessage("State / Province is required")
    .isLength({ max: 100 })
    .withMessage(
      "State / Province cannot exceed 100 characters"
    ),

  body("postalCode")
    .trim()
    .notEmpty()
    .withMessage("Postal code is required")
    .isLength({ max: 20 })
    .withMessage("Postal code cannot exceed 20 characters"),

  body("country")
    .trim()
    .notEmpty()
    .withMessage("Country is required")
    .isLength({ max: 100 })
    .withMessage("Country cannot exceed 100 characters"),
];

/* =========================================
   LOGIN VALIDATOR
========================================= */

export const loginValidator = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("Password is required"),
];

/* =========================================
   UPDATE PROFILE VALIDATOR
========================================= */

export const updateProfileValidator = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage(
      "Name must be between 2 and 50 characters"
    ),

  body("email")
    .optional()
    .trim()
    .isEmail()
    .withMessage(
      "Please provide a valid email address"
    )
    .normalizeEmail(),

  body("phone")
    .optional()
    .trim()
    .isLength({ min: 7, max: 20 })
    .withMessage(
      "Please provide a valid phone number"
    ),

  body("address")
    .optional()
    .trim()
    .isLength({ max: 300 })
    .withMessage(
      "Address cannot exceed 300 characters"
    ),
];

/* =========================================
   CHANGE PASSWORD VALIDATOR
========================================= */

export const changePasswordValidator = [
  body("currentPassword")
    .notEmpty()
    .withMessage("Current password is required"),

  body("newPassword")
    .notEmpty()
    .withMessage("New password is required")
    .isLength({ min: 8, max: 100 })
    .withMessage(
      "New password must be between 8 and 100 characters"
    ),
];

/* =========================================
   FORGOT PASSWORD VALIDATOR
========================================= */

export const forgotPasswordValidator = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail(),
];

/* =========================================
   RESET PASSWORD VALIDATOR
========================================= */

export const resetPasswordValidator = [
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8, max: 100 })
    .withMessage("Password must be between 8 and 100 characters"),

  body("confirmPassword")
    .notEmpty()
    .withMessage("Please confirm your password")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }

      return true;
    }),
];