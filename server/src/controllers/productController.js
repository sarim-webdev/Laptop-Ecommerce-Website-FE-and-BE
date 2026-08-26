import Product from "../models/Product.js";
import Category from "../models/Category.js";
import mongoose from "mongoose";
import cloudinary from "../config/cloudinary.js";

import { successResponse, errorResponse } from "../utils/apiResponse.js";

/* =========================================
   GENERATE SLUG
========================================= */

const generateSlug = (name) => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};

/* =========================================
   CREATE UNIQUE SLUG
========================================= */

const createUniqueSlug = async (name, excludeId = null) => {
  const baseSlug = generateSlug(name);

  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const query = {
      slug,
    };

    if (excludeId) {
      query._id = {
        $ne: excludeId,
      };
    }

    const existingProduct = await Product.findOne(query);

    if (!existingProduct) {
      return slug;
    }

    slug = `${baseSlug}-${counter}`;
    counter++;
  }
};

/* =========================================
   PARSE SPECIFICATIONS
========================================= */

const parseSpecifications = (specifications) => {
  if (!specifications) {
    return {};
  }

  if (typeof specifications === "object") {
    return specifications;
  }

  if (typeof specifications === "string") {
    try {
      return JSON.parse(specifications);
    } catch (error) {
      return {};
    }
  }

  return {};
};

/* =========================================
   GET ALL PRODUCTS
   GET /api/products
   PUBLIC
========================================= */

export const getProducts = async (req, res, next) => {
  try {
    /* =========================================
       FETCH ACTIVE PRODUCTS
    ========================================= */

    const products = await Product.find({
      isActive: true,
    })
      .populate(
        "category",
        "name slug description"
      )
      .sort({
        featured: -1,
        createdAt: -1,
      });

    /* =========================================
       RESPONSE
    ========================================= */

    return successResponse(
      res,
      200,
      "Products retrieved successfully.",
      products
    );
  } catch (error) {
    next(error);
  }
};

/* =========================================
   GET SINGLE PRODUCT
   GET /api/products/:id
   PUBLIC
========================================= */

export const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;

    /* =========================================
       VALIDATE PRODUCT ID
    ========================================= */

    if (!mongoose.isValidObjectId(id)) {
      return errorResponse(
        res,
        400,
        "Invalid product ID."
      );
    }

    /* =========================================
       FIND ACTIVE PRODUCT
    ========================================= */

    const product = await Product.findOne({
      _id: id,
      isActive: true,
    }).populate(
      "category",
      "name slug"
    );

    /* =========================================
       PRODUCT NOT FOUND
    ========================================= */

    if (!product) {
      return errorResponse(
        res,
        404,
        "Product not found."
      );
    }

    /* =========================================
       RESPONSE
    ========================================= */

    return successResponse(
      res,
      200,
      "Product retrieved successfully.",
      product
    );
  } catch (error) {
    next(error);
  }
};

/* =========================================
   CREATE PRODUCT
   POST /api/products
   ADMIN ONLY
========================================= */

export const createProduct = async (req, res, next) => {
  try {
    const {
      name,
      description,
      price,
      compareAtPrice,
      category,
      brand,
      stock,
      featured,
    } = req.body;

    /* =========================================
       BASIC VALIDATION
    ========================================= */

    if (typeof name !== "string" || !name.trim()) {
      return errorResponse(
        res,
        400,
        "Product name is required.",
      );
    }

    if (typeof description !== "string" || !description.trim()) {
      return errorResponse(
        res,
        400,
        "Product description is required.",
      );
    }

    if (name.trim().length < 3) {
      return errorResponse(
        res,
        400,
        "Product name must be at least 3 characters.",
      );
    }

    if (description.trim().length < 20) {
      return errorResponse(
        res,
        400,
        "Product description must be at least 20 characters.",
      );
    }

    /* =========================================
       PRICE VALIDATION
    ========================================= */

    const numericPrice = Number(price);

    if (!Number.isFinite(numericPrice) || numericPrice < 0) {
      return errorResponse(
        res,
        400,
        "Product price must be a valid non-negative number.",
      );
    }

    /* =========================================
       STOCK VALIDATION
    ========================================= */

    const numericStock = Number(stock);

    if (
      !Number.isInteger(numericStock) ||
      numericStock < 0
    ) {
      return errorResponse(
        res,
        400,
        "Product stock must be a valid non-negative integer.",
      );
    }

    /* =========================================
       COMPARE-AT PRICE VALIDATION
    ========================================= */

    let numericCompareAtPrice = null;

    if (
      compareAtPrice !== undefined &&
      compareAtPrice !== ""
    ) {
      numericCompareAtPrice = Number(compareAtPrice);

      if (
        !Number.isFinite(numericCompareAtPrice) ||
        numericCompareAtPrice < 0
      ) {
        return errorResponse(
          res,
          400,
          "Compare-at price must be a valid non-negative number.",
        );
      }

      /*
        Compare-at price should normally
        be greater than or equal to selling price.
      */

      if (numericCompareAtPrice < numericPrice) {
        return errorResponse(
          res,
          400,
          "Compare-at price cannot be less than product price.",
        );
      }
    }

    /* =========================================
       CATEGORY VALIDATION
    ========================================= */

    if (!category) {
      return errorResponse(
        res,
        400,
        "Product category is required.",
      );
    }

    if (!mongoose.isValidObjectId(category)) {
      return errorResponse(
        res,
        400,
        "Invalid category ID.",
      );
    }

    const existingCategory = await Category.findById(category);

    if (!existingCategory) {
      return errorResponse(
        res,
        404,
        "Category not found.",
      );
    }

    /* =========================================
       BRAND
    ========================================= */

    const productBrand =
      typeof brand === "string"
        ? brand.trim()
        : "";

    /* =========================================
       CREATE UNIQUE SLUG
    ========================================= */

    const productName = name.trim();

    const slug = await createUniqueSlug(productName);

    /* =========================================
       PARSE SPECIFICATIONS
    ========================================= */

    const specifications = parseSpecifications(
      req.body.specifications,
    );

    /* =========================================
       PROCESS CLOUDINARY IMAGES
    ========================================= */

    const images = Array.isArray(req.files)
      ? req.files.map((file) => ({
          url: file.path,
          publicId: file.filename,
        }))
      : [];

    /* =========================================
       CREATE PRODUCT
    ========================================= */

    const product = await Product.create({
      name: productName,

      slug,

      description: description.trim(),

      price: numericPrice,

      compareAtPrice: numericCompareAtPrice,

      category,

      brand: productBrand,

      stock: numericStock,

      images,

      specifications,

      featured:
        featured === true ||
        featured === "true",

      rating: 0,

      numReviews: 0,

      isActive: true,
    });

    /* =========================================
       POPULATE CATEGORY
    ========================================= */

    await product.populate(
      "category",
      "name slug",
    );

    /* =========================================
       SUCCESS RESPONSE
    ========================================= */

    return successResponse(
      res,
      201,
      "Product created successfully.",
      product,
    );
  } catch (error) {
    /* =========================================
       CLEAN CLOUDINARY IMAGES
       IF DATABASE CREATION FAILS
    ========================================= */

    if (
      Array.isArray(req.files) &&
      req.files.length > 0
    ) {
      for (const file of req.files) {
        try {
          if (file.filename) {
            await cloudinary.uploader.destroy(
              file.filename,
            );
          }
        } catch (cloudinaryError) {
          console.error(
            "Cloudinary cleanup failed:",
            cloudinaryError.message,
          );
        }
      }
    }

    next(error);
  }
};

/* =========================================
   UPDATE PRODUCT
   PUT /api/products/:id
   ADMIN ONLY
========================================= */

export const updateProduct = async (req, res, next) => {
  const uploadedNewImages = [];

  try {
    const { id } = req.params;

    /* =========================================
       VALIDATE PRODUCT ID
    ========================================= */

    if (!mongoose.isValidObjectId(id)) {
      return errorResponse(
        res,
        400,
        "Invalid product ID."
      );
    }

    /* =========================================
       FIND PRODUCT
    ========================================= */

    const product = await Product.findById(id);

    if (!product) {
      return errorResponse(
        res,
        404,
        "Product not found."
      );
    }

    /* =========================================
       UPDATE NAME
    ========================================= */

    if (req.body.name !== undefined) {
      const name = req.body.name.trim();

      if (!name) {
        return errorResponse(
          res,
          400,
          "Product name cannot be empty."
        );
      }

      if (name.length < 3) {
        return errorResponse(
          res,
          400,
          "Product name must be at least 3 characters."
        );
      }

      if (name.length > 150) {
        return errorResponse(
          res,
          400,
          "Product name cannot exceed 150 characters."
        );
      }

      product.name = name;

      product.slug = await createUniqueSlug(
        name,
        id
      );
    }

    /* =========================================
       UPDATE DESCRIPTION
    ========================================= */

    if (req.body.description !== undefined) {
      const description =
        req.body.description.trim();

      if (!description) {
        return errorResponse(
          res,
          400,
          "Product description cannot be empty."
        );
      }

      if (description.length < 20) {
        return errorResponse(
          res,
          400,
          "Product description must be at least 20 characters."
        );
      }

      if (description.length > 5000) {
        return errorResponse(
          res,
          400,
          "Product description cannot exceed 5000 characters."
        );
      }

      product.description = description;
    }

    /* =========================================
       UPDATE PRICE
    ========================================= */

    if (req.body.price !== undefined) {
      const numericPrice = Number(
        req.body.price
      );

      if (
        !Number.isFinite(numericPrice) ||
        numericPrice < 0
      ) {
        return errorResponse(
          res,
          400,
          "Product price must be a valid non-negative number."
        );
      }

      product.price = numericPrice;
    }

    /* =========================================
       UPDATE COMPARE AT PRICE
    ========================================= */

    if (
      req.body.compareAtPrice !== undefined
    ) {
      if (
        req.body.compareAtPrice === ""
      ) {
        product.compareAtPrice = null;
      } else {
        const numericCompareAtPrice =
          Number(
            req.body.compareAtPrice
          );

        if (
          !Number.isFinite(
            numericCompareAtPrice
          ) ||
          numericCompareAtPrice < 0
        ) {
          return errorResponse(
            res,
            400,
            "Compare-at price must be a valid non-negative number."
          );
        }

        product.compareAtPrice =
          numericCompareAtPrice;
      }
    }

    /* =========================================
       UPDATE CATEGORY
    ========================================= */

    if (req.body.category !== undefined) {
      const categoryId =
        req.body.category;

      if (
        !mongoose.isValidObjectId(
          categoryId
        )
      ) {
        return errorResponse(
          res,
          400,
          "Invalid category ID."
        );
      }

      const category =
        await Category.findById(
          categoryId
        );

      if (!category) {
        return errorResponse(
          res,
          404,
          "Category not found."
        );
      }

      product.category = categoryId;
    }

    /* =========================================
       UPDATE BRAND
    ========================================= */

    if (req.body.brand !== undefined) {
      const brand =
        req.body.brand.trim();

      if (brand.length > 100) {
        return errorResponse(
          res,
          400,
          "Brand cannot exceed 100 characters."
        );
      }

      product.brand = brand;
    }

    /* =========================================
       UPDATE STOCK
    ========================================= */

    if (req.body.stock !== undefined) {
      const numericStock =
        Number(req.body.stock);

      if (
        !Number.isInteger(
          numericStock
        ) ||
        numericStock < 0
      ) {
        return errorResponse(
          res,
          400,
          "Product stock must be a valid non-negative integer."
        );
      }

      product.stock = numericStock;
    }

    /* =========================================
       UPDATE FEATURED
    ========================================= */

    if (req.body.featured !== undefined) {
      product.featured =
        req.body.featured === true ||
        req.body.featured === "true";
    }

    /* =========================================
       UPDATE SPECIFICATIONS
    ========================================= */

    if (
      req.body.specifications !==
      undefined
    ) {
      const specifications =
        parseSpecifications(
          req.body.specifications
        );

      product.specifications =
        specifications;
    }

    /* =========================================
       HANDLE EXISTING IMAGES
    ========================================= */

    let existingImages = [];

    if (
      req.body.existingImages !== undefined
    ) {
      try {
        existingImages =
          typeof req.body.existingImages ===
          "string"
            ? JSON.parse(
                req.body.existingImages
              )
            : req.body.existingImages;

        if (
          !Array.isArray(existingImages)
        ) {
          existingImages = [];
        }
      } catch (error) {
        return errorResponse(
          res,
          400,
          "Invalid existing images data."
        );
      }
    } else {
      /*
        If frontend does not send existingImages,
        keep all current images.
      */

      existingImages =
        product.images.map(
          (image) => image.publicId
        );
    }

    /* =========================================
       CHECK IMAGE LIMIT
    ========================================= */

    const newFilesCount =
      Array.isArray(req.files)
        ? req.files.length
        : 0;

    if (
      existingImages.length +
        newFilesCount >
      5
    ) {
      return errorResponse(
        res,
        400,
        "A product can have a maximum of 5 images."
      );
    }

    /* =========================================
       FIND REMOVED OLD IMAGES
    ========================================= */

    const removedImages =
      product.images.filter(
        (oldImage) =>
          !existingImages.includes(
            oldImage.publicId
          )
      );

    /* =========================================
       DELETE REMOVED IMAGES FROM CLOUDINARY
    ========================================= */

    for (
      const image of removedImages
    ) {
      if (!image.publicId) {
        continue;
      }

      try {
        await cloudinary.uploader.destroy(
          image.publicId
        );
      } catch (cloudinaryError) {
        console.error(
          `Failed to delete removed Cloudinary image ${image.publicId}:`,
          cloudinaryError.message
        );
      }
    }

    /* =========================================
       KEEP EXISTING IMAGES
    ========================================= */

    const keptExistingImages =
      product.images.filter(
        (image) =>
          existingImages.includes(
            image.publicId
          )
      );

    /* =========================================
       UPLOAD NEW IMAGES
    ========================================= */

    const newImages =
      Array.isArray(req.files)
        ? req.files.map((file) => {
            const image = {
              url: file.path,
              publicId: file.filename,
            };

            uploadedNewImages.push(
              image
            );

            return image;
          })
        : [];

    /* =========================================
       FINAL IMAGES
    ========================================= */

    product.images = [
      ...keptExistingImages,
      ...newImages,
    ];

    /* =========================================
       SAVE PRODUCT
    ========================================= */

    await product.save();

    /* =========================================
       POPULATE CATEGORY
    ========================================= */

    await product.populate(
      "category",
      "name slug"
    );

    /* =========================================
       RESPONSE
    ========================================= */

    return successResponse(
      res,
      200,
      "Product updated successfully.",
      product
    );

  } catch (error) {

    /* =========================================
       CLEAN NEW CLOUDINARY IMAGES
       IF UPDATE FAILS
    ========================================= */

    if (
      uploadedNewImages.length > 0
    ) {
      for (
        const image of uploadedNewImages
      ) {
        try {
          if (image.publicId) {
            await cloudinary.uploader.destroy(
              image.publicId
            );
          }
        } catch (cloudinaryError) {
          console.error(
            `Failed to cleanup new Cloudinary image ${image.publicId}:`,
            cloudinaryError.message
          );
        }
      }
    }

    next(error);
  }
};

/* =========================================
   DELETE PRODUCT
   DELETE /api/products/:id
   ADMIN ONLY
========================================= */

export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    /* =========================================
       VALIDATE PRODUCT ID
    ========================================= */

    if (!mongoose.isValidObjectId(id)) {
      return errorResponse(
        res,
        400,
        "Invalid product ID."
      );
    }

    /* =========================================
       FIND PRODUCT
    ========================================= */

    const product = await Product.findById(id);

    if (!product) {
      return errorResponse(
        res,
        404,
        "Product not found."
      );
    }

    /* =========================================
       CHECK IF ALREADY DELETED
    ========================================= */

    if (!product.isActive) {
      return errorResponse(
        res,
        400,
        "Product is already deleted."
      );
    }

    /* =========================================
       SOFT DELETE PRODUCT
    ========================================= */

    product.isActive = false;

    await product.save();

    /* =========================================
       RESPONSE
    ========================================= */

    return successResponse(
      res,
      200,
      "Product deleted successfully.",
      null
    );
  } catch (error) {
    next(error);
  }
};
