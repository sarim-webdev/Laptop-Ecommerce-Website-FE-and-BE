import Category from "../models/Category.js";
import Product from "../models/Product.js";
import mongoose from "mongoose";
import { successResponse, errorResponse } from "../utils/apiResponse.js";

/* =========================================
   CREATE CATEGORY
   POST /api/categories
   ADMIN ONLY
========================================= */

export const createCategory = async (req, res, next) => {
  try {
    const { name, description} = req.body;

    /* =========================================
       VALIDATE NAME
    ========================================= */

    if (!name || !name.trim()) {
      return errorResponse(res, 400, "Category name is required.");
    }

    const categoryName = name.trim();

    const categorySlug = categoryName
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

    const existingSlug = await Category.findOne({
      slug: categorySlug,
    });

    if (existingSlug) {
      return errorResponse(
        res,
        409,
        "A category with this name already exists.",
      );
    }

    /* =========================================
       CHECK DUPLICATE CATEGORY
    ========================================= */

    const existingCategory = await Category.findOne({
      name: {
        $regex: `^${categoryName}$`,
        $options: "i",
      },
    });

    if (existingCategory) {
      return errorResponse(
        res,
        409,
        "A category with this name already exists.",
      );
    }

    /* =========================================
       CREATE CATEGORY
    ========================================= */

    const category = await Category.create({
      name: categoryName,
      slug: categorySlug,
      description: description?.trim() || "",
    });

    return successResponse(
      res,
      201,
      "Category created successfully.",
      category,
    );
  } catch (error) {
    next(error);
  }
};

/* =========================================
   GET ALL CATEGORIES
   GET /api/categories
========================================= */

export const getAllCategories = async (req, res, next) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);

    const limit = Math.min(Number(req.query.limit) || 20, 100);

    const skip = (page - 1) * limit;

    const search = req.query.search?.trim();

    /* =========================================
         SEARCH FILTER
      ========================================= */

    const filter = {};

    if (search) {
      filter.$or = [
        {
          name: {
            $regex: search,
            $options: "i",
          },
        },

        {
          description: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    /* =========================================
         FETCH CATEGORIES
      ========================================= */

    const [categories, totalCategories] = await Promise.all([
      Category.find(filter)
        .sort({
          createdAt: -1,
        })
        .skip(skip)
        .limit(limit),

      Category.countDocuments(filter),
    ]);

    /* =========================================
         ADD PRODUCT COUNT
      ========================================= */

    const categoriesWithCount = await Promise.all(
      categories.map(async (category) => {
        const productCount = await Product.countDocuments({
          category: category._id,
        });

        return {
          ...category.toObject(),
          productCount,
        };
      }),
    );

    const totalPages = Math.ceil(totalCategories / limit);

    return successResponse(res, 200, "Categories retrieved successfully.", {
      categories: categoriesWithCount,

      pagination: {
        currentPage: page,
        totalPages,
        totalCategories,
        limit,

        hasNextPage: page < totalPages,

        hasPreviousPage: page > 1,
      },
    });
  } catch (error) {
    next(error);
  }
};

/* =========================================
   GET SINGLE CATEGORY
   GET /api/categories/:id
========================================= */

export const getCategoryById = async (req, res, next) => {
  try {
    const { id } = req.params;

    /* =========================================
         FIND CATEGORY
      ========================================= */

    const category = await Category.findById(id);

    if (!mongoose.isValidObjectId(id)) {
      return errorResponse(res, 400, "Invalid category ID.");
    }

    if (!category) {
      return errorResponse(res, 404, "Category not found.");
    }

    /* =========================================
         GET CATEGORY PRODUCTS
      ========================================= */

    const products = await Product.find({
      category: category._id,
      isActive: true,
    })
      .select("name price images brand stock featured")
      .sort({
        createdAt: -1,
      });

    /* =========================================
         RESPONSE
      ========================================= */

    return successResponse(res, 200, "Category retrieved successfully.", {
      category,

      productCount: products.length,

      products,
    });
  } catch (error) {
    next(error);
  }
};

/* =========================================
   UPDATE CATEGORY
   PUT /api/categories/:id
   ADMIN ONLY
========================================= */

export const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { name, description} = req.body;

    /* =========================================
         FIND CATEGORY
      ========================================= */

    const category = await Category.findById(id);

    if (!category) {
      return errorResponse(res, 404, "Category not found.");
    }

    /* =========================================
         UPDATE NAME
      ========================================= */

    if (name !== undefined) {
      const categoryName = name.trim();

      if (!categoryName) {
        return errorResponse(res, 400, "Category name cannot be empty.");
      }

      /* =========================================
           CHECK DUPLICATE NAME
        ========================================= */

      const duplicateCategory = await Category.findOne({
        name: {
          $regex: `^${categoryName}$`,
          $options: "i",
        },

        _id: {
          $ne: id,
        },
      });

      if (duplicateCategory) {
        return errorResponse(
          res,
          409,
          "A category with this name already exists.",
        );
      }

      category.name = categoryName;
      const newSlug = categoryName
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");

      if (!newSlug) {
        return errorResponse(
          res,
          400,
          "Category name must contain valid characters.",
        );
      }

      const duplicateSlug = await Category.findOne({
        slug: newSlug,
        _id: { $ne: id },
      });

      if (duplicateSlug) {
        return errorResponse(
          res,
          409,
          "A category with this name already exists.",
        );
      }

      category.slug = newSlug;
    }

    /* =========================================
         UPDATE DESCRIPTION
      ========================================= */

    if (description !== undefined) {
      category.description = description.trim();
    }

    /* =========================================
         SAVE
      ========================================= */

    await category.save();

    return successResponse(
      res,
      200,
      "Category updated successfully.",
      category,
    );
  } catch (error) {
    next(error);
  }
};

/* =========================================
   DELETE CATEGORY
   DELETE /api/categories/:id
   ADMIN ONLY
========================================= */

export const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    /* =========================================
         FIND CATEGORY
      ========================================= */

    const category = await Category.findById(id);

    if (!category) {
      return errorResponse(res, 404, "Category not found.");
    }

    /* =========================================
         CHECK PRODUCTS
      ========================================= */

    const productCount = await Product.countDocuments({
      category: id,
    });

    if (productCount > 0) {
      return errorResponse(
        res,
        400,
        `Cannot delete this category because ${productCount} product(s) are associated with it. Move or delete those products first.`,
      );
    }

    /* =========================================
         DELETE CATEGORY
      ========================================= */

    await Category.findByIdAndDelete(id);

    return successResponse(res, 200, "Category deleted successfully.");
  } catch (error) {
    next(error);
  }
};

/* =========================================
   GET CATEGORY PRODUCTS
   GET /api/categories/:id/products
========================================= */

export const getCategoryProducts = async (req, res, next) => {
  try {
    const { id } = req.params;

    /* =========================================
         CHECK CATEGORY
      ========================================= */

    const category = await Category.findById(id);

    if (!mongoose.isValidObjectId(id)) {
      return errorResponse(res, 400, "Invalid category ID.");
    }

    if (!category) {
      return errorResponse(res, 404, "Category not found.");
    }

    /* =========================================
         PAGINATION
      ========================================= */

    const page = Math.max(Number(req.query.page) || 1, 1);

    const limit = Math.min(Number(req.query.limit) || 12, 100);

    const skip = (page - 1) * limit;

    /* =========================================
         PRODUCTS
      ========================================= */

    const [products, totalProducts] = await Promise.all([
      Product.find({
        category: id,
        isActive: true,
      })
        .sort({
          createdAt: -1,
        })
        .skip(skip)
        .limit(limit),

      Product.countDocuments({
        category: id,
        isActive: true,
      }),
    ]);

    const totalPages = Math.ceil(totalProducts / limit);

    return successResponse(
      res,
      200,
      "Category products retrieved successfully.",
      {
        category: {
          id: category._id,
          name: category.name,
          description: category.description,
        },

        products,

        pagination: {
          currentPage: page,
          totalPages,
          totalProducts,
          limit,

          hasNextPage: page < totalPages,

          hasPreviousPage: page > 1,
        },
      },
    );
  } catch (error) {
    next(error);
  }
};
