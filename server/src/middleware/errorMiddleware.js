import env from "../config/environment.js";

const errorMiddleware = (err, req, res, next) => {
  console.error("ERROR:", err);

  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  /* =========================================
     MONGOOSE VALIDATION ERROR
  ========================================= */

  if (err.name === "ValidationError") {
    statusCode = 400;

    const errors = Object.values(err.errors).map((error) => ({
      field: error.path,
      message: error.message,
    }));

    return res.status(statusCode).json({
      success: false,
      message: "Validation failed",
      errors,
    });
  }

  /* =========================================
     MONGOOSE CAST ERROR
  ========================================= */

  if (err.name === "CastError") {
    statusCode = 400;

    return res.status(statusCode).json({
      success: false,
      message: `Invalid ${err.path}: ${err.value}`,
    });
  }

  /* =========================================
     MONGOOSE DUPLICATE KEY ERROR
  ========================================= */

  if (err.code === 11000) {
    statusCode = 409;

    const field = Object.keys(err.keyValue)[0];

    return res.status(statusCode).json({
      success: false,
      message: `${field} already exists.`,
    });
  }

  /* =========================================
     JSON PARSING ERROR
  ========================================= */

  if (err instanceof SyntaxError && err.status === 400) {
    statusCode = 400;

    return res.status(statusCode).json({
      success: false,
      message: "Invalid JSON format.",
    });
  }

  /* =========================================
     MULTER ERROR
  ========================================= */

  if (err.name === "MulterError") {
    statusCode = 400;

    return res.status(statusCode).json({
      success: false,
      message: `File upload error: ${err.message}`,
    });
  }

  /* =========================================
     DEFAULT ERROR RESPONSE
  ========================================= */

  return res.status(statusCode).json({
    success: false,
    message,

    ...(env.nodeEnv === "development" && {
      stack: err.stack,
    }),
  });
};

export default errorMiddleware;