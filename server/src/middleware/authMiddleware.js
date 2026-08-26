import jwt from "jsonwebtoken";
import env from "../config/environment.js";

const authMiddleware = (req, res, next) => {
  try {
    console.log("========== AUTH DEBUG ==========");
    console.log("NODE ENV:", env.nodeEnv);
    console.log("COOKIES:", req.cookies);
    console.log("TOKEN:", req.cookies?.token);
    console.log("JWT SECRET EXISTS:", !!env.jwtSecretKey);

    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication required. Please login first.",
      });
    }

    const decoded = jwt.verify(
      token,
      env.jwtSecretKey
    );

    console.log("JWT DECODED:", decoded);

    req.user = {
      _id: decoded.id,
      id: decoded.id,
      role: decoded.role,
    };

    next();

  } catch (error) {
    console.error("AUTH ERROR:", error);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Your session has expired. Please login again.",
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid authentication token.",
      });
    }

    return res.status(401).json({
      success: false,
      message: "Authentication failed.",
    });
  }
};

export default authMiddleware;