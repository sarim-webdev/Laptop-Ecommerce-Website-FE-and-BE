import express from "express";

import {
  getProfile,
  updateProfile,
  changePassword,
  uploadAvatar,
  deleteAvatar,
} from "../controllers/userController.js";

import {
  updateProfileValidator,
  changePasswordValidator,
} from "../validators/authValidator.js";

import authMiddleware from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";
import validate from "../middleware/validationMiddleware.js";

const router = express.Router();

/* =========================================
   ALL USER ROUTES REQUIRE LOGIN
========================================= */

router.use(authMiddleware);

/* =========================================
   GET PROFILE
========================================= */

router.get(
  "/profile",
  getProfile
);

/* =========================================
   UPDATE PROFILE
========================================= */

router.patch(
  "/profile",
  updateProfileValidator,
  validate,
  updateProfile
);

/* =========================================
   CHANGE PASSWORD
========================================= */

router.patch(
  "/change-password",
  changePasswordValidator,
  validate,
  changePassword
);

/* =========================================
   UPLOAD AVATAR
========================================= */

router.patch(
  "/avatar",
  (req, res, next) => {
    req.uploadFolder = "profile";
    next();
  },
  upload.single("avatar"),
  uploadAvatar
);

/* =========================================
   DELETE AVATAR
========================================= */

router.delete(
  "/avatar",
  deleteAvatar
);

export default router;