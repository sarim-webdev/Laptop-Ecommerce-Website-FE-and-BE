import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import productService from "../../services/productService";
import reviewService from "../../services/reviewService";
import useCart from "../../hooks/useCart";
import useAuth from "../../hooks/useAuth";

import Loader from "../../components/common/Loader";

/* =========================================
   STAR RATING COMPONENT
========================================= */

const StarRating = ({
  rating = 0,
  size = "text-lg",
  interactive = false,
  onChange,
}) => {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const active = star <= Number(rating);

        if (interactive) {
          return (
            <button
              key={star}
              type="button"
              onClick={() => onChange(star)}
              className={`${size} transition hover:scale-110 ${active
                ? "text-cyan-400"
                : "text-gray-700 hover:text-cyan-400"
                }`}
            >
              ★
            </button>
          );
        }

        return (
          <span
            key={star}
            className={`${size} ${active
              ? "text-cyan-400"
              : "text-gray-700"
              }`}
          >
            ★
          </span>
        );
      })}
    </div>
  );
};

/* =========================================
   PRODUCT DETAILS PAGE
========================================= */

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    addToCart,
    loading: cartLoading,
  } = useCart();

  const {
    user,
    isAuthenticated,
  } = useAuth();

  /* =========================================
     PRODUCT STATES
  ========================================= */

  const [product, setProduct] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState("");

  /* =========================================
     REVIEW STATES
  ========================================= */

  const [reviewsData, setReviewsData] = useState({
    reviews: [],
    summary: {
      averageRating: 0,
      totalReviews: 0,
      fiveStars: 0,
      fourStars: 0,
      threeStars: 0,
      twoStars: 0,
      oneStar: 0,
    },
    pagination: {},
  });

  const [reviewsLoading, setReviewsLoading] =
    useState(true);

  const [reviewError, setReviewError] =
    useState("");

  /* =========================================
     REVIEW FORM
  ========================================= */

  const [reviewRating, setReviewRating] =
    useState(5);

  const [reviewTitle, setReviewTitle] =
    useState("");

  const [reviewComment, setReviewComment] =
    useState("");

  const [reviewSubmitting, setReviewSubmitting] =
    useState(false);

  /* =========================================
     EDIT REVIEW
  ========================================= */

  const [editingReviewId, setEditingReviewId] =
    useState(null);

  const [editRating, setEditRating] =
    useState(5);

  const [editTitle, setEditTitle] =
    useState("");

  const [editComment, setEditComment] =
    useState("");

  const [editSubmitting, setEditSubmitting] =
    useState(false);

  /* =========================================
     DELETE REVIEW
  ========================================= */

  const [deletingReviewId, setDeletingReviewId] =
    useState(null);

  /* =========================================
     FETCH PRODUCT
  ========================================= */

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await productService.getProductById(id);

      const productData =
        response?.data?.product ||
        response?.product ||
        response?.data;

      if (!productData) {
        throw new Error("Product not found.");
      }

      setProduct(productData);

      const mainImage =
        productData.image ||
        productData.imageUrl ||
        productData.images?.[0]?.url ||
        productData.images?.[0] ||
        "";

      setSelectedImage(mainImage);
    } catch (err) {
      console.error(
        "Failed to load product:",
        err
      );

      setError(
        err?.response?.data?.message ||
        "Unable to load this product."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================================
     FETCH REVIEWS
  ========================================= */

  const fetchReviews = async () => {
    try {
      setReviewsLoading(true);
      setReviewError("");

      const response =
        await reviewService.getProductReviews(
          id,
          {
            page: 1,
            limit: 10,
          }
        );

      console.log(
        "REVIEWS RESPONSE:",
        response
      );

      const data =
        response?.data ||
        response;

      setReviewsData({
        reviews:
          data?.reviews || [],

        summary:
          data?.summary || {
            averageRating: 0,
            totalReviews: 0,
            fiveStars: 0,
            fourStars: 0,
            threeStars: 0,
            twoStars: 0,
            oneStar: 0,
          },

        pagination:
          data?.pagination || {},
      });
    } catch (err) {
      console.error(
        "Failed to load reviews:",
        err
      );

      setReviewError(
        err?.response?.data?.message ||
        "Unable to load reviews."
      );
    } finally {
      setReviewsLoading(false);
    }
  };

  /* =========================================
     LOAD PRODUCT + REVIEWS
  ========================================= */

  useEffect(() => {
    if (id) {
      fetchProduct();
      fetchReviews();
    }
  }, [id]);

  /* =========================================
     QUANTITY
  ========================================= */

  const increaseQuantity = () => {
    const stock =
      Number(product?.stock) || 99;

    setQuantity((previous) =>
      Math.min(previous + 1, stock)
    );
  };

  const decreaseQuantity = () => {
    setQuantity((previous) =>
      Math.max(previous - 1, 1)
    );
  };

  /* =========================================
     ADD TO CART
  ========================================= */

  const handleAddToCart = async () => {
    try {
      await addToCart(
        product._id,
        quantity
      );
    } catch (err) {
      console.error(
        "Failed to add product:",
        err
      );
    }
  };

  /* =========================================
     BUY NOW
  ========================================= */

  const handleBuyNow = async () => {
    try {
      await addToCart(
        product._id,
        quantity
      );

      navigate("/cart");
    } catch (err) {
      console.error(
        "Failed to process purchase:",
        err
      );
    }
  };

  /* =========================================
     CREATE REVIEW
  ========================================= */

  const handleCreateReview = async (
    event
  ) => {
    event.preventDefault();

    if (!isAuthenticated) {
      navigate("/sign-in");
      return;
    }

    if (!reviewRating) {
      return;
    }

    try {
      setReviewSubmitting(true);
      setReviewError("");

      await reviewService.createReview(
        id,
        {
          rating: reviewRating,
          title: reviewTitle,
          comment: reviewComment,
        }
      );

      setReviewRating(5);
      setReviewTitle("");
      setReviewComment("");

      await fetchReviews();
      await fetchProduct();
    } catch (err) {
      console.error(
        "Failed to create review:",
        err
      );

      setReviewError(
        err?.response?.data?.message ||
        "Unable to submit review."
      );
    } finally {
      setReviewSubmitting(false);
    }
  };

  /* =========================================
     START EDIT REVIEW
  ========================================= */

  const handleStartEdit = (review) => {
    setEditingReviewId(review._id);

    setEditRating(
      Number(review.rating) || 5
    );

    setEditTitle(
      review.title || ""
    );

    setEditComment(
      review.comment || ""
    );

    setReviewError("");
  };

  /* =========================================
     CANCEL EDIT
  ========================================= */

  const handleCancelEdit = () => {
    setEditingReviewId(null);
    setEditRating(5);
    setEditTitle("");
    setEditComment("");
  };

  /* =========================================
     UPDATE REVIEW
  ========================================= */

  const handleUpdateReview = async (
    event,
    reviewId
  ) => {
    event.preventDefault();

    try {
      setEditSubmitting(true);
      setReviewError("");

      await reviewService.updateReview(
        reviewId,
        {
          rating: editRating,
          title: editTitle,
          comment: editComment,
        }
      );

      handleCancelEdit();

      await fetchReviews();
      await fetchProduct();
    } catch (err) {
      console.error(
        "Failed to update review:",
        err
      );

      setReviewError(
        err?.response?.data?.message ||
        "Unable to update review."
      );
    } finally {
      setEditSubmitting(false);
    }
  };

  /* =========================================
     DELETE REVIEW
  ========================================= */

  const handleDeleteReview = async (
    reviewId
  ) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this review?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingReviewId(reviewId);
      setReviewError("");

      await reviewService.deleteReview(
        reviewId
      );

      await fetchReviews();
      await fetchProduct();
    } catch (err) {
      console.error(
        "Failed to delete review:",
        err
      );

      setReviewError(
        err?.response?.data?.message ||
        "Unable to delete review."
      );
    } finally {
      setDeletingReviewId(null);
    }
  };

  /* =========================================
     CHECK REVIEW OWNER
  ========================================= */

  const isReviewOwner = (review) => {
    if (!user || !review?.user) {
      return false;
    }

    const reviewUserId =
      review.user?._id ||
      review.user?.id ||
      review.user;

    const currentUserId =
      user?._id ||
      user?.id ||
      user?.userId;

    return (
      String(reviewUserId) ===
      String(currentUserId)
    );
  };

  /* =========================================
     LOADING
  ========================================= */

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#05070a]">
        <Loader />
      </main>
    );
  }

  /* =========================================
     ERROR
  ========================================= */

  if (error || !product) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#05070a] px-4">

        <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-center shadow-2xl shadow-black/40 backdrop-blur-xl">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-red-400/20 bg-red-500/10 text-2xl font-black text-red-400">
            !
          </div>

          <h1 className="mt-5 text-2xl font-bold text-white">
            Product Not Found
          </h1>

          <p className="mt-2 text-sm leading-6 text-gray-400">
            {error ||
              "The product you're looking for doesn't exist."}
          </p>

          <Link
            to="/products"
            className="mt-6 inline-flex rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-cyan-500/20 transition hover:-translate-y-0.5 hover:from-cyan-400 hover:to-blue-500"
          >
            Back to Products
          </Link>

        </div>

      </main>
    );
  }

  /* =========================================
     PRODUCT DATA
  ========================================= */

  const {
    name,
    description,
    price,
    oldPrice,
    image,
    imageUrl,
    images = [],
    category,
    brand,
    stock = 0,
    specifications = {},
  } = product;

  const productImages = [
    image,
    imageUrl,
    ...images,
  ].filter(Boolean);

  const displayImage =
    selectedImage ||
    productImages[0] ||
    "/images/product-placeholder.jpg";

  const isOutOfStock =
    Number(stock) <= 0;

  /* =========================================
     REVIEW DATA
  ========================================= */

  const {
    reviews: productReviews = [],
    summary = {},
  } = reviewsData;

  const averageRating =
    Number(summary.averageRating || 0);

  const totalReviews =
    Number(summary.totalReviews || 0);

  const ratingCounts = {
    5: Number(summary.fiveStars || 0),
    4: Number(summary.fourStars || 0),
    3: Number(summary.threeStars || 0),
    2: Number(summary.twoStars || 0),
    1: Number(summary.oneStar || 0),
  };

  /* =========================================
     RATING PERCENTAGE
  ========================================= */

  const getRatingPercentage = (star) => {
    if (!totalReviews) {
      return 0;
    }

    return Math.round(
      (ratingCounts[star] /
        totalReviews) *
      100
    );
  };

  /* =========================================
     RENDER
  ========================================= */

  return (
    <main className="min-h-screen bg-[#05070a] text-white">

      {/* =========================================
          BREADCRUMB
      ========================================= */}

      <div className="border-b border-white/[0.06] bg-[#070a0f]">

        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">

          <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">

            <Link
              to="/"
              className="transition hover:text-cyan-400"
            >
              Home
            </Link>

            <span className="text-gray-700">
              /
            </span>

            <Link
              to="/products"
              className="transition hover:text-cyan-400"
            >
              Products
            </Link>

            <span className="text-gray-700">
              /
            </span>

            <span className="max-w-[220px] truncate font-medium text-gray-300">
              {name}
            </span>

          </div>

        </div>

      </div>

      {/* =========================================
          PRODUCT SECTION
      ========================================= */}

      <section className="relative overflow-hidden px-4 py-10 sm:px-6 lg:px-8 lg:py-16">

        {/* Background Glow */}

        <div className="pointer-events-none absolute -left-40 top-20 h-96 w-96 rounded-full bg-cyan-500/[0.06] blur-3xl" />

        <div className="pointer-events-none absolute -right-40 top-40 h-96 w-96 rounded-full bg-blue-600/[0.06] blur-3xl" />

        <div className="relative mx-auto max-w-7xl">

          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">

            {/* =====================================
                PRODUCT IMAGES
            ===================================== */}

            <div>

              <div className="group relative overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-br from-white/[0.07] to-white/[0.025] shadow-2xl shadow-black/30 backdrop-blur-xl">

                <div className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/[0.08] blur-3xl" />

                <div className="relative h-[400px] w-full overflow-hidden sm:h-[520px]">

                  <img
                    src={displayImage}
                    alt={
                      name ||
                      "NEXORA Laptop"
                    }
                    className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                    onError={(event) => {
                      event.currentTarget.src =
                        "/images/product-placeholder.jpg";
                    }}
                  />

                </div>

              </div>

              {/* Thumbnails */}

              {productImages.length > 1 && (
                <div className="mt-4 flex gap-3 overflow-x-auto pb-2">

                  {productImages.map(
                    (
                      productImage,
                      index
                    ) => (
                      <button
                        key={`${productImage}-${index}`}
                        type="button"
                        onClick={() =>
                          setSelectedImage(
                            productImage
                          )
                        }
                        className={`h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 bg-white/[0.04] p-2 transition ${selectedImage ===
                          productImage
                          ? "border-cyan-400 bg-cyan-400/10 shadow-lg shadow-cyan-500/10"
                          : "border-white/10 hover:border-cyan-400/40"
                          }`}
                      >
                        <img
                          src={productImage}
                          alt={`${name} ${index + 1}`}
                          className="h-full w-full object-contain"
                        />
                      </button>
                    )
                  )}

                </div>
              )}

            </div>

            {/* =====================================
                PRODUCT INFORMATION
            ===================================== */}

            <div className="flex flex-col">

              {/* Category */}

              {category && (
                <span className="w-fit rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.15em] text-cyan-400">
                  {typeof category ===
                    "object"
                    ? category.name
                    : category}
                </span>
              )}

              {/* Name */}

              <h1 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
                {name}
              </h1>

              {/* Brand */}

              {brand && (
                <p className="mt-3 text-sm font-medium text-gray-500">
                  Brand:{" "}
                  <span className="text-gray-200">
                    {brand}
                  </span>
                </p>
              )}

              {/* Rating */}

              <div className="mt-5 flex flex-wrap items-center gap-3">

                <StarRating
                  rating={
                    averageRating
                  }
                  size="text-lg"
                />

                <span className="text-sm font-bold text-gray-200">
                  {averageRating.toFixed(
                    1
                  )}
                </span>

                <span className="text-sm text-gray-500">
                  ({totalReviews} reviews)
                </span>

              </div>

              {/* Description */}

              {description && (
                <p className="mt-6 max-w-2xl leading-7 text-gray-400">
                  {description}
                </p>
              )}

              {/* Price */}

              <div className="mt-8 flex flex-wrap items-end gap-3">

                <span className="text-3xl font-black text-white sm:text-4xl">
                  $
                  {Number(
                    price || 0
                  ).toLocaleString()}
                </span>

                {oldPrice &&
                  Number(oldPrice) >
                  Number(price) && (
                    <span className="pb-1 text-lg text-gray-600 line-through">
                      $
                      {Number(
                        oldPrice
                      ).toLocaleString()}
                    </span>
                  )}

              </div>

              {/* Stock */}

              <div className="mt-4">

                {isOutOfStock ? (
                  <span className="font-bold text-red-400">
                    Out of Stock
                  </span>
                ) : (
                  <span className="font-bold text-emerald-400">
                    {stock} items available
                  </span>
                )}

              </div>

              {/* Divider */}

              <div className="my-8 border-t border-white/[0.08]" />

              {/* Quantity */}

              {!isOutOfStock && (
                <div>

                  <p className="mb-3 text-sm font-bold text-gray-300">
                    Quantity
                  </p>

                  <div className="flex w-fit items-center overflow-hidden rounded-xl border border-white/10 bg-white/[0.04]">

                    <button
                      type="button"
                      onClick={
                        decreaseQuantity
                      }
                      disabled={
                        quantity <=
                        1
                      }
                      className="h-11 w-11 text-lg font-bold text-gray-300 transition hover:bg-white/[0.08] hover:text-cyan-400 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      −
                    </button>

                    <span className="flex h-11 w-12 items-center justify-center border-x border-white/10 text-sm font-bold text-white">
                      {quantity}
                    </span>

                    <button
                      type="button"
                      onClick={
                        increaseQuantity
                      }
                      disabled={
                        quantity >=
                        Number(stock)
                      }
                      className="h-11 w-11 text-lg font-bold text-gray-300 transition hover:bg-white/[0.08] hover:text-cyan-400 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      +
                    </button>

                  </div>

                </div>
              )}

              {/* Buttons */}

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">

                <button
                  type="button"
                  onClick={
                    handleAddToCart
                  }
                  disabled={
                    isOutOfStock ||
                    cartLoading
                  }
                  className="flex-1 rounded-xl border border-cyan-400/40 bg-cyan-400/[0.06] px-6 py-3.5 text-sm font-bold text-cyan-400 transition hover:border-cyan-400 hover:bg-cyan-400 hover:text-black hover:shadow-lg hover:shadow-cyan-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {cartLoading
                    ? "Adding..."
                    : "Add to Cart"}
                </button>

                <button
                  type="button"
                  onClick={
                    handleBuyNow
                  }
                  disabled={
                    isOutOfStock ||
                    cartLoading
                  }
                  className="flex-1 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3.5 text-sm font-black text-white shadow-lg shadow-cyan-500/20 transition hover:-translate-y-0.5 hover:from-cyan-400 hover:to-blue-500 hover:shadow-cyan-500/30 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Buy Now →
                </button>

              </div>

              {/* Trust */}

              <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">

                <div className="rounded-xl border border-white/[0.08] bg-white/[0.035] p-4 text-center transition hover:border-cyan-400/20 hover:bg-cyan-400/[0.04]">
                  <div className="text-xl">
                    🚚
                  </div>

                  <p className="mt-1 text-xs font-bold text-gray-300">
                    Fast Delivery
                  </p>
                </div>

                <div className="rounded-xl border border-white/[0.08] bg-white/[0.035] p-4 text-center transition hover:border-cyan-400/20 hover:bg-cyan-400/[0.04]">
                  <div className="text-xl">
                    🛡️
                  </div>

                  <p className="mt-1 text-xs font-bold text-gray-300">
                    1-Year Warranty
                  </p>
                </div>

                <div className="rounded-xl border border-white/[0.08] bg-white/[0.035] p-4 text-center transition hover:border-cyan-400/20 hover:bg-cyan-400/[0.04]">
                  <div className="text-xl">
                    🔒
                  </div>

                  <p className="mt-1 text-xs font-bold text-gray-300">
                    Secure Checkout
                  </p>
                </div>

              </div>

            </div>

          </div>

          {/* =========================================
              SPECIFICATIONS
          ========================================= */}

          {Object.keys(
            specifications
          ).length > 0 && (
              <div className="mt-16 border-t border-white/[0.08] pt-10">

                <h2 className="text-2xl font-black text-white">
                  Specifications
                </h2>

                <div className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.035] backdrop-blur-xl">

                  {Object.entries(
                    specifications
                  ).map(
                    ([key, value]) => (
                      <div
                        key={key}
                        className="grid grid-cols-1 gap-2 border-b border-white/[0.07] px-5 py-4 last:border-b-0 sm:grid-cols-2"
                      >

                        <span className="font-semibold capitalize text-gray-500">
                          {key.replace(
                            /([A-Z])/g,
                            " $1"
                          )}
                        </span>

                        <span className="text-gray-200 sm:text-right">
                          {String(value)}
                        </span>

                      </div>
                    )
                  )}

                </div>

              </div>
            )}

          {/* =========================================
              REVIEWS SECTION
          ========================================= */}

          <section className="mt-20 border-t border-white/[0.08] pt-12">

            {/* Header */}

            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">

              <div>

                <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-400">
                  Customer Feedback
                </p>

                <h2 className="mt-2 text-3xl font-black text-white">
                  Reviews & Ratings
                </h2>

                <p className="mt-2 text-sm text-gray-500">
                  See what customers think about this product.
                </p>

              </div>

              <div className="text-sm text-gray-500">
                {totalReviews}{" "}
                {totalReviews === 1
                  ? "review"
                  : "reviews"}
              </div>

            </div>

            {/* =====================================
                REVIEW SUMMARY
            ===================================== */}

            <div className="mt-8 grid gap-6 lg:grid-cols-[280px_1fr]">

              {/* Average */}

              <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.025] p-6 backdrop-blur-xl">

                <p className="text-xs font-bold uppercase tracking-widest text-gray-500">
                  Overall Rating
                </p>

                <div className="mt-5 flex items-end gap-3">

                  <span className="text-5xl font-black text-white">
                    {averageRating.toFixed(
                      1
                    )}
                  </span>

                  <span className="pb-2 text-sm text-gray-500">
                    / 5
                  </span>

                </div>

                <div className="mt-3">
                  <StarRating
                    rating={
                      averageRating
                    }
                    size="text-xl"
                  />
                </div>

                <p className="mt-4 text-sm text-gray-500">
                  Based on{" "}
                  <span className="font-bold text-gray-300">
                    {totalReviews}
                  </span>{" "}
                  customer reviews
                </p>

              </div>

              {/* Breakdown */}

              <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-6 backdrop-blur-xl">

                <div className="space-y-4">

                  {[5, 4, 3, 2, 1].map(
                    (star) => (
                      <div
                        key={star}
                        className="flex items-center gap-3"
                      >

                        <div className="flex w-10 items-center gap-1 text-sm font-bold text-gray-300">
                          {star}
                          <span className="text-cyan-400">
                            ★
                          </span>
                        </div>

                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/[0.08]">

                          <div
                            className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500"
                            style={{
                              width: `${getRatingPercentage(
                                star
                              )}%`,
                            }}
                          />

                        </div>

                        <span className="w-10 text-right text-xs font-bold text-gray-500">
                          {
                            ratingCounts[
                            star
                            ]
                          }
                        </span>

                      </div>
                    )
                  )}

                </div>

              </div>

            </div>

            {/* =====================================
                REVIEW FORM
            ===================================== */}

            <div className="mt-8 rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.025] p-6 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-8">

              <div className="flex items-start justify-between gap-4">

                <div>

                  <h3 className="text-xl font-black text-white">
                    Write a Review
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    Share your experience with this product.
                  </p>

                </div>

                <div className="hidden h-12 w-12 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-xl text-cyan-400 sm:flex">
                  ★
                </div>

              </div>

              {!isAuthenticated ? (
                <div className="mt-6 rounded-2xl border border-cyan-400/20 bg-cyan-400/[0.05] p-5">

                  <p className="text-sm text-gray-400">
                    You need to be logged in to write a review.
                  </p>

                  <Link
                    to="/sign-in"
                    className="mt-4 inline-flex rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2.5 text-sm font-bold text-white transition hover:from-cyan-400 hover:to-blue-500"
                  >
                    Sign In to Review
                  </Link>

                </div>
              ) : (
                <form
                  onSubmit={
                    handleCreateReview
                  }
                  className="mt-6"
                >

                  {/* Rating */}

                  <div>

                    <label className="text-sm font-bold text-gray-300">
                      Your Rating
                    </label>

                    <div className="mt-3">
                      <StarRating
                        rating={
                          reviewRating
                        }
                        size="text-2xl"
                        interactive
                        onChange={
                          setReviewRating
                        }
                      />
                    </div>

                  </div>

                  {/* Title */}

                  <div className="mt-6">

                    <label className="text-sm font-bold text-gray-300">
                      Review Title
                    </label>

                    <input
                      type="text"
                      value={
                        reviewTitle
                      }
                      onChange={(event) =>
                        setReviewTitle(
                          event.target
                            .value
                        )
                      }
                      maxLength={150}
                      placeholder="e.g. Excellent laptop!"
                      className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none placeholder:text-gray-600 transition focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/10"
                    />

                  </div>

                  {/* Comment */}

                  <div className="mt-5">

                    <label className="text-sm font-bold text-gray-300">
                      Your Review
                    </label>

                    <textarea
                      value={
                        reviewComment
                      }
                      onChange={(event) =>
                        setReviewComment(
                          event.target
                            .value
                        )
                      }
                      maxLength={1000}
                      rows={5}
                      placeholder="Tell other customers about your experience..."
                      className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm leading-6 text-white outline-none placeholder:text-gray-600 transition focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/10"
                    />

                    <p className="mt-2 text-right text-xs text-gray-600">
                      {
                        reviewComment.length
                      }
                      /1000
                    </p>

                  </div>

                  {/* Error */}

                  {reviewError && (
                    <div className="mt-4 rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                      {reviewError}
                    </div>
                  )}

                  {/* Submit */}

                  <button
                    type="submit"
                    disabled={
                      reviewSubmitting
                    }
                    className="mt-5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 text-sm font-black text-white shadow-lg shadow-cyan-500/20 transition hover:-translate-y-0.5 hover:from-cyan-400 hover:to-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {reviewSubmitting
                      ? "Submitting..."
                      : "Submit Review"}
                  </button>

                </form>
              )}

            </div>

            {/* =====================================
                REVIEW LIST
            ===================================== */}

            <div className="mt-10">

              <div className="mb-5 flex items-center justify-between">

                <h3 className="text-xl font-black text-white">
                  Customer Reviews
                </h3>

                <span className="text-sm text-gray-600">
                  Latest first
                </span>

              </div>

              {reviewsLoading ? (
                <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-8 text-center">
                  <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-cyan-400/20 border-t-cyan-400" />

                  <p className="mt-4 text-sm text-gray-500">
                    Loading reviews...
                  </p>
                </div>
              ) : reviewError &&
                productReviews.length ===
                0 ? (
                <div className="rounded-3xl border border-red-400/10 bg-red-500/[0.05] p-8 text-center text-sm text-red-400">
                  {reviewError}
                </div>
              ) : productReviews.length ===
                0 ? (
                <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-10 text-center">

                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-2xl text-cyan-400">
                    ★
                  </div>

                  <h4 className="mt-5 text-lg font-bold text-white">
                    No reviews yet
                  </h4>

                  <p className="mt-2 text-sm text-gray-500">
                    Be the first customer to review this product.
                  </p>

                </div>
              ) : (
                <div className="space-y-5">

                  {productReviews.map(
                    (review) => {

                      const reviewUser =
                        review.user ||
                        {};

                      const reviewerName =
                        reviewUser.name ||
                        "Customer";

                      const avatar =
                        reviewUser.avatar?.url ||
                        reviewUser.profileImage?.url ||
                        "";

                      const owner =
                        isReviewOwner(
                          review
                        );

                      const isEditing =
                        editingReviewId ===
                        review._id;

                      return (
                        <div
                          key={
                            review._id
                          }
                          className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.055] to-white/[0.02] p-6 backdrop-blur-xl sm:p-7"
                        >

                          {/* Review Header */}

                          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                            <div className="flex items-start gap-4">

                              {/* Avatar */}

                              {avatar ? (
                                <img
                                  src={
                                    avatar
                                  }
                                  alt={
                                    reviewerName
                                  }
                                  className="h-12 w-12 shrink-0 rounded-2xl border border-white/10 object-cover"
                                />
                              ) : (
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-lg font-black text-cyan-400">
                                  {reviewerName
                                    .charAt(
                                      0
                                    )
                                    .toUpperCase()}
                                </div>
                              )}

                              <div>

                                <div className="flex flex-wrap items-center gap-2">

                                  <h4 className="font-bold text-white">
                                    {
                                      reviewerName
                                    }
                                  </h4>

                                  {review.isVerifiedPurchase && (
                                    <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                                      ✓ Verified Purchase
                                    </span>
                                  )}

                                </div>

                                <div className="mt-1 flex flex-wrap items-center gap-3">

                                  <StarRating
                                    rating={
                                      review.rating
                                    }
                                    size="text-sm"
                                  />

                                  <span className="text-xs text-gray-600">
                                    {new Date(
                                      review.createdAt
                                    ).toLocaleDateString()}
                                  </span>

                                </div>

                              </div>

                            </div>

                            {/* Owner Actions */}

                            {owner &&
                              !isEditing && (
                                <div className="flex items-center gap-2">

                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleStartEdit(
                                        review
                                      )
                                    }
                                    className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-bold text-gray-400 transition hover:border-cyan-400/30 hover:text-cyan-400"
                                  >
                                    Edit
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleDeleteReview(
                                        review._id
                                      )
                                    }
                                    disabled={
                                      deletingReviewId ===
                                      review._id
                                    }
                                    className="rounded-lg border border-red-400/10 bg-red-500/[0.05] px-3 py-2 text-xs font-bold text-red-400 transition hover:border-red-400/30 hover:bg-red-500/10 disabled:opacity-50"
                                  >
                                    {deletingReviewId ===
                                      review._id
                                      ? "Deleting..."
                                      : "Delete"}
                                  </button>

                                </div>
                              )}

                          </div>

                          {/* =================================
                              EDIT FORM
                          ================================= */}

                          {isEditing ? (
                            <form
                              onSubmit={(
                                event
                              ) =>
                                handleUpdateReview(
                                  event,
                                  review._id
                                )
                              }
                              className="mt-6 border-t border-white/[0.08] pt-6"
                            >

                              <label className="text-sm font-bold text-gray-300">
                                Rating
                              </label>

                              <div className="mt-3">
                                <StarRating
                                  rating={
                                    editRating
                                  }
                                  size="text-2xl"
                                  interactive
                                  onChange={
                                    setEditRating
                                  }
                                />
                              </div>

                              <input
                                type="text"
                                value={
                                  editTitle
                                }
                                onChange={(
                                  event
                                ) =>
                                  setEditTitle(
                                    event
                                      .target
                                      .value
                                  )
                                }
                                maxLength={
                                  150
                                }
                                placeholder="Review title"
                                className="mt-5 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none placeholder:text-gray-600 focus:border-cyan-400/50"
                              />

                              <textarea
                                value={
                                  editComment
                                }
                                onChange={(
                                  event
                                ) =>
                                  setEditComment(
                                    event
                                      .target
                                      .value
                                  )
                                }
                                maxLength={
                                  1000
                                }
                                rows={4}
                                placeholder="Your review"
                                className="mt-4 w-full resize-none rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm leading-6 text-white outline-none placeholder:text-gray-600 focus:border-cyan-400/50"
                              />

                              <div className="mt-4 flex flex-wrap gap-3">

                                <button
                                  type="submit"
                                  disabled={
                                    editSubmitting
                                  }
                                  className="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50"
                                >
                                  {editSubmitting
                                    ? "Saving..."
                                    : "Save Changes"}
                                </button>

                                <button
                                  type="button"
                                  onClick={
                                    handleCancelEdit
                                  }
                                  className="rounded-xl border border-white/10 bg-white/[0.04] px-5 py-2.5 text-sm font-bold text-gray-400 transition hover:text-white"
                                >
                                  Cancel
                                </button>

                              </div>

                            </form>
                          ) : (
                            <>
                              {/* Review Title */}

                              {review.title && (
                                <h4 className="mt-5 text-lg font-black text-white">
                                  {
                                    review.title
                                  }
                                </h4>
                              )}

                              {/* Review Comment */}

                              {review.comment && (
                                <p className="mt-3 leading-7 text-gray-400">
                                  {
                                    review.comment
                                  }
                                </p>
                              )}
                            </>
                          )}

                        </div>
                      );
                    }
                  )}

                </div>
              )}

            </div>

          </section>

        </div>

      </section>

    </main>
  );
};

export default ProductDetails;