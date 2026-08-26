import User from "../models/User.js";

import {
  hashPassword,
  comparePassword,
} from "../utils/hashPassword.js";

import {
  successResponse,
  errorResponse,
} from "../utils/apiResponse.js";

import {
  deleteImage,
} from "../services/cloudinaryService.js";

/* =========================================
   GET PROFILE
========================================= */

export const getProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return errorResponse(
        res,
        404,
        "User not found"
      );
    }

    return successResponse(
      res,
      200,
      "Profile fetched successfully",
      user
    );
  } catch (error) {
    next(error);
  }
};

/* =========================================
   UPDATE PROFILE
========================================= */

/* =========================================
   UPDATE PROFILE
========================================= */

export const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const {
      name,
      email,
      phone,
      address,
    } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return errorResponse(
        res,
        404,
        "User not found"
      );
    }

    /* =========================================
       CHECK EMAIL DUPLICATE
    ========================================= */

    if (
      email &&
      email.toLowerCase() !== user.email
    ) {
      const existingUser = await User.findOne({
        email: email.toLowerCase(),
        _id: { $ne: userId },
      });

      if (existingUser) {
        return errorResponse(
          res,
          409,
          "Email is already registered"
        );
      }

      user.email = email.toLowerCase();
    }

    /* =========================================
       UPDATE NAME
    ========================================= */

    if (name !== undefined) {
      user.name = name.trim();
    }

    /* =========================================
       UPDATE PHONE
    ========================================= */

    if (phone !== undefined) {
      user.phone = phone.trim();
    }

    /* =========================================
       UPDATE ADDRESS
    ========================================= */

    if (address !== undefined) {
      const trimmedAddress = address.trim();

      if (user.addresses.length > 0) {
        // Existing address update
        user.addresses[0].address =
          trimmedAddress;
      } else if (trimmedAddress) {
        // Create first address
        user.addresses.push({
          fullName: user.name,
          phone: user.phone || "",
          address: trimmedAddress,
          city: "",
          state: "",
          postalCode: "",
          country: "Pakistan",
        });
      }
    }

    /* =========================================
       SAVE USER
    ========================================= */

    await user.save();

    /* =========================================
       GET UPDATED USER
    ========================================= */

    const updatedUser = await User.findById(
      userId
    ).select("-password");

    return successResponse(
      res,
      200,
      "Profile updated successfully",
      updatedUser
    );
  } catch (error) {
    next(error);
  }
};

/* =========================================
   CHANGE PASSWORD
========================================= */

export const changePassword = async (
  req,
  res,
  next
) => {
  try {
    const userId = req.user.id;

    const {
      currentPassword,
      newPassword,
    } = req.body;

    const user = await User.findById(
      userId
    ).select("+password");

    if (!user) {
      return errorResponse(
        res,
        404,
        "User not found"
      );
    }

    /* =========================================
       CHECK CURRENT PASSWORD
    ========================================= */

    const isMatch = await comparePassword(
      currentPassword,
      user.password
    );

    if (!isMatch) {
      return errorResponse(
        res,
        401,
        "Current password is incorrect"
      );
    }

    /* =========================================
       CHECK SAME PASSWORD
    ========================================= */

    const samePassword = await comparePassword(
      newPassword,
      user.password
    );

    if (samePassword) {
      return errorResponse(
        res,
        400,
        "New password must be different from current password"
      );
    }

    /* =========================================
       HASH NEW PASSWORD
    ========================================= */

    user.password =
      await hashPassword(newPassword);

    await user.save();

    return successResponse(
      res,
      200,
      "Password changed successfully"
    );
  } catch (error) {
    next(error);
  }
};

/* =========================================
   UPLOAD AVATAR
========================================= */

export const uploadAvatar = async (
  req,
  res,
  next
) => {
  try {
    const userId = req.user.id;

    if (!req.file) {
      return errorResponse(
        res,
        400,
        "Please upload an avatar image"
      );
    }

    const user = await User.findById(userId);

    if (!user) {
      return errorResponse(
        res,
        404,
        "User not found"
      );
    }

    /* =========================================
       DELETE OLD AVATAR
    ========================================= */

    if (user.avatar?.publicId) {
      try {
        await deleteImage(
          user.avatar.publicId
        );
      } catch (error) {
        console.error(
          "Old avatar deletion failed:",
          error.message
        );
      }
    }

    /* =========================================
       GET CLOUDINARY DATA
       
       multer-storage-cloudinary puts these
       values inside req.file
    ========================================= */

    const imageUrl =
      req.file.path ||
      req.file.secure_url ||
      "";

    const publicId =
      req.file.filename ||
      req.file.public_id ||
      "";

    if (!imageUrl || !publicId) {
      return errorResponse(
        res,
        500,
        "Avatar upload failed"
      );
    }

    /* =========================================
       SAVE AVATAR
    ========================================= */

    user.avatar = {
      url: imageUrl,
      publicId: publicId,
    };

    await user.save();

    const updatedUser = await User.findById(
      userId
    ).select("-password");

    return successResponse(
      res,
      200,
      "Avatar uploaded successfully",
      updatedUser
    );
  } catch (error) {
    next(error);
  }
};

/* =========================================
   DELETE AVATAR
========================================= */

export const deleteAvatar = async (
  req,
  res,
  next
) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);

    if (!user) {
      return errorResponse(
        res,
        404,
        "User not found"
      );
    }

    /* =========================================
       CHECK AVATAR
    ========================================= */

    if (!user.avatar?.publicId) {
      return errorResponse(
        res,
        404,
        "No avatar found"
      );
    }

    /* =========================================
       DELETE FROM CLOUDINARY
    ========================================= */

    await deleteImage(
      user.avatar.publicId
    );

    /* =========================================
       REMOVE AVATAR FROM DATABASE
    ========================================= */

    user.avatar = {
      url: "",
      publicId: "",
    };

    await user.save();

    const updatedUser = await User.findById(
      userId
    ).select("-password");

    return successResponse(
      res,
      200,
      "Avatar deleted successfully",
      updatedUser
    );
  } catch (error) {
    next(error);
  }
};