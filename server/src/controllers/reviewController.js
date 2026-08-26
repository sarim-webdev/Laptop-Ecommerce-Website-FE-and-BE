import mongoose from "mongoose";

import Review from "../models/Review.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";

import {
  successResponse,
  errorResponse,
} from "../utils/apiResponse.js";

/* =========================================
   HELPER:
   GET USER ID
========================================= */

const getUserId = (req) => {
  return (
    req.user?.id ||
    req.user?._id ||
    req.user?.userId
  );
};

/* =========================================
   HELPER:
   UPDATE PRODUCT RATING
========================================= */

const updateProductRating = async (
  productId
) => {
  const ratingData =
    await Review.aggregate([
      {
        $match: {
          product:
            new mongoose.Types.ObjectId(
              productId
            ),
        },
      },

      {
        $group: {
          _id: "$product",

          averageRating: {
            $avg: "$rating",
          },

          totalReviews: {
            $sum: 1,
          },
        },
      },
    ]);

  let rating = 0;
  let numReviews = 0;

  if (ratingData.length > 0) {
    rating = Number(
      ratingData[0].averageRating.toFixed(1)
    );

    numReviews =
      ratingData[0].totalReviews;
  }

  await Product.findByIdAndUpdate(
    productId,
    {
      rating,
      numReviews,
    }
  );
};

/* =========================================
   HELPER:
   CHECK VERIFIED PURCHASE
========================================= */

const checkVerifiedPurchase =
  async (
    userId,
    productId
  ) => {
    const order =
      await Order.findOne({
        user: userId,

        "orderItems.product":
          productId,

        orderStatus: "Delivered",
      });

    return !!order;
  };

/* =========================================
   GET PRODUCT REVIEWS
   GET /api/reviews/product/:productId

   PUBLIC
========================================= */

export const getProductReviews =
  async (
    req,
    res,
    next
  ) => {
    try {
      const {
        productId,
      } = req.params;

      /* =========================================
         CHECK PRODUCT ID
      ========================================= */

      if (
        !mongoose.Types.ObjectId.isValid(
          productId
        )
      ) {
        return errorResponse(
          res,
          400,
          "Invalid product ID."
        );
      }

      /* =========================================
         CHECK PRODUCT
      ========================================= */

      const product =
        await Product.findOne({
          _id: productId,
          isActive: true,
        });

      if (!product) {
        return errorResponse(
          res,
          404,
          "Product not found."
        );
      }

      /* =========================================
         PAGINATION
      ========================================= */

      const page = Math.max(
        Number(req.query.page) || 1,
        1
      );

      const limit = Math.min(
        Number(req.query.limit) || 10,
        50
      );

      const skip =
        (page - 1) * limit;

      /* =========================================
         GET REVIEWS
      ========================================= */

      const [
        reviews,
        totalReviews,
      ] = await Promise.all([
        Review.find({
          product: productId,
        })
          .populate(
            "user",
            "name avatar profileImage"
          )
          .sort({
            createdAt: -1,
          })
          .skip(skip)
          .limit(limit),

        Review.countDocuments({
          product: productId,
        }),
      ]);

      /* =========================================
         RATING SUMMARY
      ========================================= */

      const ratingData =
        await Review.aggregate([
          {
            $match: {
              product:
                new mongoose.Types.ObjectId(
                  productId
                ),
            },
          },

          {
            $group: {
              _id: null,

              averageRating: {
                $avg: "$rating",
              },

              totalReviews: {
                $sum: 1,
              },

              fiveStars: {
                $sum: {
                  $cond: [
                    {
                      $eq: [
                        "$rating",
                        5,
                      ],
                    },
                    1,
                    0,
                  ],
                },
              },

              fourStars: {
                $sum: {
                  $cond: [
                    {
                      $eq: [
                        "$rating",
                        4,
                      ],
                    },
                    1,
                    0,
                  ],
                },
              },

              threeStars: {
                $sum: {
                  $cond: [
                    {
                      $eq: [
                        "$rating",
                        3,
                      ],
                    },
                    1,
                    0,
                  ],
                },
              },

              twoStars: {
                $sum: {
                  $cond: [
                    {
                      $eq: [
                        "$rating",
                        2,
                      ],
                    },
                    1,
                    0,
                  ],
                },
              },

              oneStar: {
                $sum: {
                  $cond: [
                    {
                      $eq: [
                        "$rating",
                        1,
                      ],
                    },
                    1,
                    0,
                  ],
                },
              },
            },
          },
        ]);

      const summary =
        ratingData.length > 0
          ? {
              averageRating:
                Number(
                  ratingData[0].averageRating.toFixed(
                    1
                  )
                ),

              totalReviews:
                ratingData[0]
                  .totalReviews,

              fiveStars:
                ratingData[0]
                  .fiveStars,

              fourStars:
                ratingData[0]
                  .fourStars,

              threeStars:
                ratingData[0]
                  .threeStars,

              twoStars:
                ratingData[0]
                  .twoStars,

              oneStar:
                ratingData[0]
                  .oneStar,
            }
          : {
              averageRating: 0,
              totalReviews: 0,
              fiveStars: 0,
              fourStars: 0,
              threeStars: 0,
              twoStars: 0,
              oneStar: 0,
            };

      const totalPages =
        Math.ceil(
          totalReviews /
            limit
        );

      /* =========================================
         RESPONSE
      ========================================= */

      return successResponse(
        res,
        200,
        "Product reviews retrieved successfully.",
        {
          reviews,

          summary,

          pagination: {
            currentPage: page,
            totalPages,
            totalReviews,
            limit,

            hasNextPage:
              page < totalPages,

            hasPreviousPage:
              page > 1,
          },
        }
      );
    } catch (error) {
      next(error);
    }
  };

/* =========================================
   CREATE REVIEW
   POST /api/reviews/product/:productId

   LOGIN REQUIRED
========================================= */

export const createReview =
  async (
    req,
    res,
    next
  ) => {
    try {
      const {
        productId,
      } = req.params;

      const userId =
        getUserId(req);

      const {
        rating,
        title,
        comment,
      } = req.body;

      /* =========================================
         CHECK USER
      ========================================= */

      if (!userId) {
        return errorResponse(
          res,
          401,
          "Authentication required."
        );
      }

      /* =========================================
         CHECK PRODUCT ID
      ========================================= */

      if (
        !mongoose.Types.ObjectId.isValid(
          productId
        )
      ) {
        return errorResponse(
          res,
          400,
          "Invalid product ID."
        );
      }

      /* =========================================
         CHECK PRODUCT
      ========================================= */

      const product =
        await Product.findOne({
          _id: productId,
          isActive: true,
        });

      if (!product) {
        return errorResponse(
          res,
          404,
          "Product not found."
        );
      }

      /* =========================================
         VALIDATE RATING
      ========================================= */

      const numericRating =
        Number(rating);

      if (
        !Number.isInteger(
          numericRating
        ) ||
        numericRating < 1 ||
        numericRating > 5
      ) {
        return errorResponse(
          res,
          400,
          "Rating must be between 1 and 5."
        );
      }

      /* =========================================
         CHECK EXISTING REVIEW
      ========================================= */

      const existingReview =
        await Review.findOne({
          product: productId,
          user: userId,
        });

      if (existingReview) {
        return errorResponse(
          res,
          409,
          "You have already reviewed this product."
        );
      }

      /* =========================================
         CHECK VERIFIED PURCHASE
      ========================================= */

      const isVerifiedPurchase =
        await checkVerifiedPurchase(
          userId,
          productId
        );

        if (!isVerifiedPurchase) {
  return errorResponse(
    res,
    403,
    "You can only review products you have purchased and received."
  );
}

      /* =========================================
         CREATE REVIEW
      ========================================= */

      const review =
        await Review.create({
          product: productId,

          user: userId,

          rating:
            numericRating,

          title:
            title?.trim() || "",

          comment:
            comment?.trim() || "",

          isVerifiedPurchase,
        });

      /* =========================================
         UPDATE PRODUCT RATING
      ========================================= */

      await updateProductRating(
        productId
      );

      /* =========================================
         POPULATE USER
      ========================================= */

      await review.populate(
        "user",
        "name avatar profileImage"
      );

      /* =========================================
         RESPONSE
      ========================================= */

      return successResponse(
        res,
        201,
        "Review created successfully.",
        review
      );
    } catch (error) {
      /* =========================================
         DUPLICATE KEY ERROR
      ========================================= */

      if (
        error.code === 11000
      ) {
        return errorResponse(
          res,
          409,
          "You have already reviewed this product."
        );
      }

      next(error);
    }
  };

/* =========================================
   UPDATE REVIEW
   PUT /api/reviews/:reviewId

   LOGIN REQUIRED
========================================= */

export const updateReview =
  async (
    req,
    res,
    next
  ) => {
    try {
      const {
        reviewId,
      } = req.params;

      const userId =
        getUserId(req);

      const {
        rating,
        title,
        comment,
      } = req.body;

      /* =========================================
         CHECK AUTH
      ========================================= */

      if (!userId) {
        return errorResponse(
          res,
          401,
          "Authentication required."
        );
      }

      /* =========================================
         CHECK REVIEW ID
      ========================================= */

      if (
        !mongoose.Types.ObjectId.isValid(
          reviewId
        )
      ) {
        return errorResponse(
          res,
          400,
          "Invalid review ID."
        );
      }

      /* =========================================
         FIND REVIEW
      ========================================= */

      const review =
        await Review.findById(
          reviewId
        );

      if (!review) {
        return errorResponse(
          res,
          404,
          "Review not found."
        );
      }

      /* =========================================
         OWNERSHIP CHECK
      ========================================= */

      const isOwner =
        review.user.toString() ===
        userId.toString();

      const isAdmin =
        req.user?.role ===
        "admin";

      if (
        !isOwner &&
        !isAdmin
      ) {
        return errorResponse(
          res,
          403,
          "You are not authorized to update this review."
        );
      }

      /* =========================================
         UPDATE RATING
      ========================================= */

      if (
        rating !== undefined
      ) {
        const numericRating =
          Number(rating);

        if (
          !Number.isInteger(
            numericRating
          ) ||
          numericRating < 1 ||
          numericRating > 5
        ) {
          return errorResponse(
            res,
            400,
            "Rating must be between 1 and 5."
          );
        }

        review.rating =
          numericRating;
      }

      /* =========================================
         UPDATE TITLE
      ========================================= */

      if (
        title !== undefined
      ) {
        review.title =
          title.trim();
      }

      /* =========================================
         UPDATE COMMENT
      ========================================= */

      if (
        comment !== undefined
      ) {
        review.comment =
          comment.trim();
      }

      /* =========================================
         SAVE
      ========================================= */

      await review.save();

      /* =========================================
         RECALCULATE PRODUCT RATING
      ========================================= */

      await updateProductRating(
        review.product
      );

      /* =========================================
         POPULATE USER
      ========================================= */

      await review.populate(
        "user",
        "name avatar profileImage"
      );

      /* =========================================
         RESPONSE
      ========================================= */

      return successResponse(
        res,
        200,
        "Review updated successfully.",
        review
      );
    } catch (error) {
      next(error);
    }
  };

/* =========================================
   DELETE REVIEW
   DELETE /api/reviews/:reviewId

   LOGIN REQUIRED
========================================= */

export const deleteReview =
  async (
    req,
    res,
    next
  ) => {
    try {
      const {
        reviewId,
      } = req.params;

      const userId =
        getUserId(req);

      /* =========================================
         CHECK AUTH
      ========================================= */

      if (!userId) {
        return errorResponse(
          res,
          401,
          "Authentication required."
        );
      }

      /* =========================================
         CHECK REVIEW ID
      ========================================= */

      if (
        !mongoose.Types.ObjectId.isValid(
          reviewId
        )
      ) {
        return errorResponse(
          res,
          400,
          "Invalid review ID."
        );
      }

      /* =========================================
         FIND REVIEW
      ========================================= */

      const review =
        await Review.findById(
          reviewId
        );

      if (!review) {
        return errorResponse(
          res,
          404,
          "Review not found."
        );
      }

      /* =========================================
         OWNERSHIP CHECK
      ========================================= */

      const isOwner =
        review.user.toString() ===
        userId.toString();

      const isAdmin =
        req.user?.role ===
        "admin";

      if (
        !isOwner &&
        !isAdmin
      ) {
        return errorResponse(
          res,
          403,
          "You are not authorized to delete this review."
        );
      }

      /* =========================================
         SAVE PRODUCT ID
         BEFORE DELETE
      ========================================= */

      const productId =
        review.product;

      /* =========================================
         DELETE REVIEW
      ========================================= */

      await Review.findByIdAndDelete(
        reviewId
      );

      /* =========================================
         RECALCULATE PRODUCT RATING
      ========================================= */

      await updateProductRating(
        productId
      );

      /* =========================================
         RESPONSE
      ========================================= */

      return successResponse(
        res,
        200,
        "Review deleted successfully.",
        null
      );
    } catch (error) {
      next(error);
    }
  };