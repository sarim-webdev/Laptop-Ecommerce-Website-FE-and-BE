import { body, param, query } from "express-validator";

/* =========================================
   CREATE PRODUCT VALIDATOR
========================================= */

export const createProductValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Product name is required")
    .isLength({ min: 3, max: 150 })
    .withMessage("Product name must be between 3 and 150 characters"),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Product description is required")
    .isLength({ min: 20, max: 5000 })
    .withMessage("Description must be between 20 and 5000 characters"),

  body("price")
    .notEmpty()
    .withMessage("Product price is required")
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number")
    .toFloat(),

  body("category")
    .trim()
    .notEmpty()
    .withMessage("Product category is required"),

  body("brand")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Brand name cannot exceed 100 characters"),

  body("stock")
    .notEmpty()
    .withMessage("Product stock is required")
    .isInt({ min: 0 })
    .withMessage("Stock must be a non-negative integer")
    .toInt(),

  body("featured")
    .optional()
    .isBoolean()
    .withMessage("Featured must be true or false")
    .toBoolean(),

  body("specifications")
  .optional()
  .custom((value) => {
    try {
      const parsed = JSON.parse(value);

      if (
        typeof parsed !== "object" ||
        parsed === null ||
        Array.isArray(parsed)
      ) {
        throw new Error();
      }

      return true;
    } catch {
      throw new Error(
        "Specifications must be a valid JSON object"
      );
    }
  }),
];

/* =========================================
   UPDATE PRODUCT VALIDATOR
========================================= */

export const updateProductValidator = [
  param("id")
    .isMongoId()
    .withMessage("Invalid product ID"),

  body("name")
    .optional()
    .trim()
    .isLength({ min: 3, max: 150 })
    .withMessage("Product name must be between 3 and 150 characters"),

  body("description")
    .optional()
    .trim()
    .isLength({ min: 20, max: 5000 })
    .withMessage("Description must be between 20 and 5000 characters"),

  body("price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number")
    .toFloat(),

  body("category")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Category cannot be empty"),

  body("brand")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Brand name cannot exceed 100 characters"),

  body("stock")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Stock must be a non-negative integer")
    .toInt(),

  body("featured")
    .optional()
    .isBoolean()
    .withMessage("Featured must be true or false")
    .toBoolean(),

  body("existingImages")
    .optional()
    .custom((value) => {
      try {
        const parsed = JSON.parse(value);

        if (!Array.isArray(parsed)) {
          throw new Error();
        }

        for (const image of parsed) {
          if (
            typeof image !== "object" ||
            image === null ||
            typeof image.publicId !== "string" ||
            typeof image.url !== "string"
          ) {
            throw new Error();
          }
        }

        return true;
      } catch {
        throw new Error(
          "Existing images must be a valid JSON array."
        );
      }
    }),

  body("specifications")
  .optional()
  .custom((value) => {
    try {
      const parsed = JSON.parse(value);

      if (
        typeof parsed !== "object" ||
        parsed === null ||
        Array.isArray(parsed)
      ) {
        throw new Error();
      }

      return true;
    } catch {
      throw new Error(
        "Specifications must be a valid JSON object"
      );
    }
  }),
];

/* =========================================
   PRODUCT ID VALIDATOR
========================================= */

export const productIdValidator = [
  param("id")
    .isMongoId()
    .withMessage("Invalid product ID"),
];

/* =========================================
   PRODUCT QUERY VALIDATOR
========================================= */

export const productQueryValidator = [
  query("search")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Search query is too long"),

  query("category")
    .optional()
    .trim(),

  query("brand")
    .optional()
    .trim(),

  query("minPrice")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Minimum price must be a positive number")
    .toFloat(),

  query("maxPrice")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Maximum price must be a positive number")
    .toFloat(),

  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be at least 1")
    .toInt(),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100")
    .toInt(),
];