import crypto from "crypto";

import User from "../models/User.js";

import { hashPassword, comparePassword } from "../utils/hashPassword.js";

import generateToken from "../utils/generateToken.js";

import { successResponse, errorResponse } from "../utils/apiResponse.js";

import { sendWelcomeEmail, sendEmail } from "../services/emailService.js";

import env from "../config/environment.js";

import { uploadImage } from "../services/cloudinaryService.js";

/* =========================================
   COOKIE OPTIONS
========================================= */

const isProduction = env.nodeEnv === "production";

const cookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
  path: "/",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

/* =========================================
   REGISTER
   POST /api/auth/register
========================================= */

export const register = async (req, res, next) => {
  try {
    /* =========================================
       GET REGISTER DATA
    ========================================= */

    const {
      name,
      email,
      password,
      phone,
      address,
      city,
      state,
      postalCode,
      country,
    } = req.body;

    /* =========================================
       CHECK EXISTING USER
    ========================================= */

    const existingUser = await User.findOne({
      email,
    });

    if (existingUser) {
      return errorResponse(
        res,
        409,
        "An account with this email already exists.",
      );
    }

    /* =========================================
       HASH PASSWORD
    ========================================= */

    const hashedPassword = await hashPassword(password);

    /* =========================================
       PREPARE AVATAR
    ========================================= */

    let avatar = {
      url: "",
      publicId: "",
    };

    if (req.file) {
      const image = await uploadImage(req.file.buffer, "nexora/profiles");

      avatar = {
        url: image.url,
        publicId: image.publicId,
      };
    }
    /* =========================================
       PREPARE ADDRESS
    ========================================= */

    const addresses = address?.trim()
      ? [
          {
            fullName: name,
            phone: phone || "",
            address: address.trim(),
            city: city?.trim() || "",
            state: state?.trim() || "",
            postalCode: postalCode?.trim() || "",
            country: country?.trim() || "",
          },
        ]
      : [];

    /* =========================================
       CREATE USER
    ========================================= */

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,

      avatar,

      addresses,
    });

    /* =========================================
       GENERATE JWT
    ========================================= */

    const token = generateToken(user);

    /* =========================================
       SET COOKIE
    ========================================= */

    res.cookie("token", token, cookieOptions);

    /* =========================================
       SEND WELCOME EMAIL
    ========================================= */

    try {
      await sendWelcomeEmail(user.email, user.name);
    } catch (emailError) {
      console.error("Welcome email failed:", emailError.message);
    }

    /* =========================================
       USER RESPONSE
    ========================================= */

    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,

      avatar: user.avatar,

      addresses: user.addresses,

      isActive: user.isActive,

      createdAt: user.createdAt,
    };

    /* =========================================
       SUCCESS RESPONSE
    ========================================= */

    return successResponse(
      res,
      201,
      "Account created successfully.",
      userResponse,
    );
  } catch (error) {
    next(error);
  }
};

/* =========================================
   LOGIN
   POST /api/auth/login
========================================= */

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    /* =========================================
       FIND USER + PASSWORD
    ========================================= */

    const user = await User.findOne({
      email,
    }).select("+password");

    if (!user) {
      return errorResponse(res, 401, "Invalid email or password.");
    }

    /* =========================================
       CHECK ACTIVE ACCOUNT
    ========================================= */

    if (!user.isActive) {
      return errorResponse(res, 403, "Your account has been deactivated.");
    }

    /* =========================================
       COMPARE PASSWORD
    ========================================= */

    const isPasswordMatch = await comparePassword(password, user.password);

    if (!isPasswordMatch) {
      return errorResponse(res, 401, "Invalid email or password.");
    }

    /* =========================================
       UPDATE LAST LOGIN
    ========================================= */

    user.lastLogin = new Date();

    await user.save();

    /* =========================================
       GENERATE TOKEN
    ========================================= */

    const token = generateToken(user);

    /* =========================================
       SET COOKIE
    ========================================= */

    res.cookie("token", token, cookieOptions);

    /* =========================================
       USER RESPONSE
    ========================================= */

    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      avatar: user.avatar,
      lastLogin: user.lastLogin,
    };

    return successResponse(res, 200, "Login successful.", userResponse);
  } catch (error) {
    next(error);
  }
};

/* =========================================
   LOGOUT
   POST /api/auth/logout
========================================= */

export const logout = async (req, res, next) => {
  try {
    const clearCookieOptions = {
      httpOnly: true,
      secure: env.nodeEnv === "production",
      sameSite: env.nodeEnv === "production" ? "none" : "lax",
    };

    res.clearCookie("token", clearCookieOptions);

    return successResponse(res, 200, "Logout successful.");
  } catch (error) {
    next(error);
  }
};

/* =========================================
   FORGOT PASSWORD
   POST /api/auth/forgot-password
========================================= */

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({
      email,
    });

    /*
      Security:
      Don't reveal whether the email exists.
    */

    if (!user) {
      return successResponse(
        res,
        200,
        "If an account with this email exists, a password reset link has been sent.",
      );
    }

    /* =========================================
       GENERATE RESET TOKEN
    ========================================= */

    const resetToken = crypto.randomBytes(32).toString("hex");

    const hashedResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    /* =========================================
       SAVE RESET TOKEN
    ========================================= */

    user.resetPasswordToken = hashedResetToken;

    user.resetPasswordExpire = new Date(Date.now() + 15 * 60 * 1000);

    await user.save({
      validateBeforeSave: false,
    });

    /* =========================================
       RESET URL
    ========================================= */

    const clientUrl =
      env.nodeEnv === "production"
        ? env.clientUrls.production
        : env.clientUrls.local;

    const resetUrl = `${clientUrl}/reset-password/${resetToken}`;

    /* =========================================
       SEND RESET EMAIL
    ========================================= */

    try {
      await sendEmail({
        to: user.email,

        subject: "NEXORA Password Reset Request",

        text: `You requested a password reset for your NEXORA account. Reset your password using this link: ${resetUrl}`,

        html: `
          <div style="
            font-family: Arial, sans-serif;
            max-width: 600px;
            margin: auto;
            padding: 30px;
            background: #111111;
            color: #ffffff;
            border-radius: 12px;
          ">

            <h1 style="color: #38bdf8;">
              Reset Your Password
            </h1>

            <p>
              Hello ${user.name},
            </p>

            <p>
              We received a request to reset your
              NEXORA account password.
            </p>

            <p>
              This password reset link will expire
              in 15 minutes.
            </p>

            <a
              href="${resetUrl}"
              style="
                display: inline-block;
                padding: 12px 24px;
                background: #38bdf8;
                color: #000000;
                text-decoration: none;
                border-radius: 8px;
                font-weight: bold;
              "
            >
              Reset Password
            </a>

            <p style="margin-top: 25px;">
              If you did not request this password reset,
              you can safely ignore this email.
            </p>

          </div>
        `,
      });
    } catch (emailError) {
      /*
        Remove reset token if email fails.
      */

      user.resetPasswordToken = null;
      user.resetPasswordExpire = null;

      await user.save({
        validateBeforeSave: false,
      });

      throw emailError;
    }

    return successResponse(
      res,
      200,
      "If an account with this email exists, a password reset link has been sent.",
    );
  } catch (error) {
    next(error);
  }
};

/* =========================================
   RESET PASSWORD
   POST /api/auth/reset-password/:token
========================================= */

export const resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;

    const { password } = req.body;

    /* =========================================
       HASH TOKEN
    ========================================= */

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    /* =========================================
       FIND USER
    ========================================= */

    const user = await User.findOne({
      resetPasswordToken: hashedToken,

      resetPasswordExpire: {
        $gt: new Date(),
      },
    });

    if (!user) {
      return errorResponse(
        res,
        400,
        "Password reset token is invalid or has expired.",
      );
    }

    /* =========================================
       HASH NEW PASSWORD
    ========================================= */

    const hashedPassword = await hashPassword(password);

    /* =========================================
       UPDATE PASSWORD
    ========================================= */

    user.password = hashedPassword;

    user.resetPasswordToken = null;

    user.resetPasswordExpire = null;

    await user.save();

    /* =========================================
       GENERATE NEW LOGIN TOKEN
    ========================================= */

    const authToken = generateToken(user);

    res.cookie("token", authToken, cookieOptions);

    /* =========================================
       RESPONSE
    ========================================= */

    return successResponse(
      res,
      200,
      "Password reset successfully. You are now logged in.",
    );
  } catch (error) {
    next(error);
  }
};
