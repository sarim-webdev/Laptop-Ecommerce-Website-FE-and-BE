import { useCallback, useEffect, useState } from "react";

import reviewService from "../../services/reviewService";
import useAuth from "../../hooks/useAuth";


const ReviewsSection = ({ productId }) => {
  const { user, isAuthenticated } = useAuth();

  const [reviews, setReviews] = useState([]);
  const [summary, setSummary] = useState({
    averageRating: 0,
    totalReviews: 0,
    fiveStars: 0,
    fourStars: 0,
    threeStars: 0,
    twoStars: 0,
    oneStar: 0,
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    rating: 5,
    title: "",
    comment: "",
  });


  /* =========================================
     FETCH REVIEWS
  ========================================= */

  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await reviewService.getProductReviews(
          productId,
          {
            page: 1,
            limit: 10,
          }
        );

      const data = response?.data || {};

      setReviews(
        Array.isArray(data.reviews)
          ? data.reviews
          : []
      );

      setSummary(
        data.summary || {
          averageRating: 0,
          totalReviews: 0,
          fiveStars: 0,
          fourStars: 0,
          threeStars: 0,
          twoStars: 0,
          oneStar: 0,
        }
      );

    } catch (err) {
      console.error(
        "Reviews Error:",
        err
      );

      setError(
        err?.response?.data?.message ||
        "Failed to load reviews."
      );
    } finally {
      setLoading(false);
    }
  }, [productId]);


  /* =========================================
     INITIAL LOAD
  ========================================= */

  useEffect(() => {
    if (productId) {
      fetchReviews();
    }
  }, [productId, fetchReviews]);


  /* =========================================
     FORM CHANGE
  ========================================= */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  /* =========================================
     CREATE REVIEW
  ========================================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      setError(
        "Please login to write a review."
      );
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      setSuccess("");

      await reviewService.createReview(
        productId,
        {
          rating: Number(form.rating),
          title: form.title,
          comment: form.comment,
        }
      );

      setForm({
        rating: 5,
        title: "",
        comment: "",
      });

      setSuccess(
        "Your review has been added successfully."
      );

      await fetchReviews();

    } catch (err) {
      console.error(
        "Create Review Error:",
        err
      );

      setError(
        err?.response?.data?.message ||
        "Failed to create review."
      );
    } finally {
      setSubmitting(false);
    }
  };


  /* =========================================
     STAR DISPLAY
  ========================================= */

  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map(
          (star) => (
            <span
              key={star}
              className={
                star <= rating
                  ? "text-yellow-400"
                  : "text-slate-700"
              }
            >
              ★
            </span>
          )
        )}
      </div>
    );
  };


  /* =========================================
     RATING BAR
  ========================================= */

  const getPercentage = (count) => {
    if (!summary.totalReviews) {
      return 0;
    }

    return (
      (count / summary.totalReviews) *
      100
    );
  };


  return (
    <section className="mt-12 border-t border-white/10 pt-10">

      {/* =========================================
          HEADER
      ========================================= */}

      <div className="mb-8">

        <span className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-400">
          Customer Feedback
        </span>

        <h2 className="mt-2 text-2xl font-black text-white sm:text-3xl">
          Customer Reviews
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          See what customers are saying about this product.
        </p>

      </div>


      {/* =========================================
          RATING SUMMARY
      ========================================= */}

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">

        {/* Overall Rating */}

        <div className="rounded-3xl border border-white/10 bg-[#0b1119] p-6">

          <p className="text-sm font-semibold text-slate-400">
            Overall Rating
          </p>

          <div className="mt-4 flex items-end gap-3">

            <span className="text-5xl font-black text-white">
              {summary.averageRating.toFixed(1)}
            </span>

            <span className="pb-2 text-sm text-slate-500">
              / 5
            </span>

          </div>

          <div className="mt-3">
            {renderStars(
              Math.round(
                summary.averageRating
              )
            )}
          </div>

          <p className="mt-3 text-sm text-slate-500">
            Based on{" "}
            <span className="font-semibold text-white">
              {summary.totalReviews}
            </span>{" "}
            reviews
          </p>

        </div>


        {/* Rating Breakdown */}

        <div className="rounded-3xl border border-white/10 bg-[#0b1119] p-6">

          <h3 className="text-sm font-bold text-white">
            Rating Breakdown
          </h3>

          <div className="mt-5 space-y-3">

            {[
              {
                stars: 5,
                count: summary.fiveStars,
              },
              {
                stars: 4,
                count: summary.fourStars,
              },
              {
                stars: 3,
                count: summary.threeStars,
              },
              {
                stars: 2,
                count: summary.twoStars,
              },
              {
                stars: 1,
                count: summary.oneStar,
              },
            ].map((item) => (

              <div
                key={item.stars}
                className="flex items-center gap-3"
              >

                <span className="w-8 text-xs font-semibold text-slate-400">
                  {item.stars} ★
                </span>

                <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/5">

                  <div
                    className="h-full rounded-full bg-yellow-400 transition-all duration-500"
                    style={{
                      width: `${getPercentage(
                        item.count
                      )}%`,
                    }}
                  />

                </div>

                <span className="w-6 text-right text-xs text-slate-500">
                  {item.count}
                </span>

              </div>

            ))}

          </div>

        </div>

      </div>


      {/* =========================================
          REVIEW FORM
      ========================================= */}

      <div className="mt-8 rounded-3xl border border-white/10 bg-gradient-to-br from-[#0c131d] to-[#070b11] p-6 sm:p-8">

        <div className="mb-6">

          <h3 className="text-xl font-bold text-white">
            Write a Review
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Share your experience with this product.
          </p>

        </div>


        {!isAuthenticated ? (

          <div className="rounded-2xl border border-cyan-400/10 bg-cyan-400/5 p-5">

            <p className="text-sm text-slate-400">
              Please login to write a review.
            </p>

          </div>

        ) : (

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* Rating */}

            <div>

              <label className="mb-2 block text-sm font-semibold text-slate-300">
                Your Rating
              </label>

              <div className="flex gap-2">

                {[1, 2, 3, 4, 5].map(
                  (star) => (

                    <button
                      key={star}
                      type="button"
                      onClick={() =>
                        setForm((prev) => ({
                          ...prev,
                          rating: star,
                        }))
                      }
                      className={`text-3xl transition ${
                        star <= form.rating
                          ? "text-yellow-400"
                          : "text-slate-700"
                      } hover:scale-110`}
                    >
                      ★
                    </button>

                  )
                )}

              </div>

            </div>


            {/* Title */}

            <div>

              <label className="mb-2 block text-sm font-semibold text-slate-300">
                Review Title
              </label>

              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                maxLength={150}
                placeholder="Give your review a title"
                className="w-full rounded-xl border border-white/10 bg-[#070c12] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/40"
              />

            </div>


            {/* Comment */}

            <div>

              <label className="mb-2 block text-sm font-semibold text-slate-300">
                Your Review
              </label>

              <textarea
                name="comment"
                value={form.comment}
                onChange={handleChange}
                maxLength={1000}
                rows={5}
                placeholder="Tell us about your experience..."
                className="w-full resize-none rounded-xl border border-white/10 bg-[#070c12] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/40"
              />

            </div>


            {/* Error */}

            {error && (
              <div className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}


            {/* Success */}

            {success && (
              <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-400">
                {success}
              </div>
            )}


            {/* Submit */}

            <button
              type="submit"
              disabled={submitting}
              className="rounded-xl bg-cyan-400 px-6 py-3 text-sm font-bold text-black transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting
                ? "Submitting..."
                : "Submit Review"}
            </button>

          </form>

        )}

      </div>


      {/* =========================================
          REVIEWS LIST
      ========================================= */}

      <div className="mt-8">

        <div className="mb-5 flex items-center justify-between">

          <h3 className="text-xl font-bold text-white">
            Customer Reviews
          </h3>

          <span className="text-sm text-slate-500">
            {reviews.length} reviews
          </span>

        </div>


        {/* Loading */}

        {loading && (

          <div className="rounded-2xl border border-white/10 bg-[#0b1119] p-8 text-center">

            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-white/10 border-t-cyan-400" />

            <p className="mt-3 text-sm text-slate-500">
              Loading reviews...
            </p>

          </div>

        )}


        {/* Error */}

        {!loading && error && reviews.length === 0 && (

          <div className="rounded-2xl border border-red-400/20 bg-red-400/10 p-5 text-sm text-red-400">
            {error}
          </div>

        )}


        {/* Empty */}

        {!loading &&
          !error &&
          reviews.length === 0 && (

            <div className="rounded-3xl border border-white/10 bg-[#0b1119] p-10 text-center">

              <div className="text-4xl">
                ⭐
              </div>

              <h3 className="mt-4 text-lg font-bold text-white">
                No Reviews Yet
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Be the first customer to review this product.
              </p>

            </div>

          )}


        {/* Reviews */}

        {!loading &&
          reviews.length > 0 && (

            <div className="space-y-4">

              {reviews.map((review) => (

                <article
                  key={review._id}
                  className="rounded-3xl border border-white/10 bg-[#0b1119] p-6"
                >

                  <div className="flex items-start gap-4">

                    {/* Avatar */}

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-cyan-400/10 font-bold text-cyan-400">

                      {review.user?.avatar?.url ? (

                        <img
                          src={review.user.avatar.url}
                          alt={review.user.name || "User"}
                          className="h-full w-full object-cover"
                        />

                      ) : (

                        (
                          review.user?.name ||
                          "U"
                        )
                          .charAt(0)
                          .toUpperCase()

                      )}

                    </div>


                    {/* Content */}

                    <div className="min-w-0 flex-1">

                      <div className="flex flex-wrap items-center gap-3">

                        <h4 className="font-bold text-white">
                          {review.user?.name ||
                            "Anonymous User"}
                        </h4>

                        {review.isVerifiedPurchase && (

                          <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-400">
                            Verified Purchase
                          </span>

                        )}

                      </div>


                      <div className="mt-2 flex flex-wrap items-center gap-3">

                        {renderStars(
                          review.rating
                        )}

                        <span className="text-xs text-slate-600">
                          {new Date(
                            review.createdAt
                          ).toLocaleDateString()}
                        </span>

                      </div>


                      {review.title && (

                        <h5 className="mt-4 font-bold text-white">
                          {review.title}
                        </h5>

                      )}

                      {review.comment && (

                        <p className="mt-2 text-sm leading-6 text-slate-400">
                          {review.comment}
                        </p>

                      )}

                    </div>

                  </div>

                </article>

              ))}

            </div>

          )}

      </div>

    </section>
  );
};

export default ReviewsSection;