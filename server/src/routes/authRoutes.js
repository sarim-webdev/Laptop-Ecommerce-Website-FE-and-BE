import express from "express";

import {
  register,
  login,
  logout,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";

import {
  registerValidator,
  loginValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
} from "../validators/authValidator.js";

import validate from "../middleware/validationMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

/* =========================================
   REGISTER
========================================= */

router.post(
  "/register",
  (req, res, next) => {
    req.uploadFolder = "profile";
    next();
  },
  upload.single("avatar"),
  registerValidator,
  validate,
  register
);

/* =========================================
   LOGIN
========================================= */

router.post(
  "/login",
  loginValidator,
  validate,
  login
);

/* =========================================
   LOGOUT
========================================= */

router.post(
  "/logout",
  logout
);

/* =========================================
   FORGOT PASSWORD
========================================= */

router.post(
  "/forgot-password",
  forgotPasswordValidator,
  validate,
  forgotPassword
);

/* =========================================
   RESET PASSWORD
========================================= */

router.post(
  "/reset-password/:token",
  resetPasswordValidator,
  validate,
  resetPassword
);

export default router;