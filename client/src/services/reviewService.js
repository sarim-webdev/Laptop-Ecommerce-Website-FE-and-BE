import api from "./api";


/* =========================================
   GET PRODUCT REVIEWS
   GET /api/reviews/product/:productId
   PUBLIC
========================================= */

const getProductReviews = async (
  productId,
  params = {}
) => {
  const response = await api.get(
    `/reviews/product/${productId}`,
    {
      params,
    }
  );

  return response.data;
};


/* =========================================
   CREATE REVIEW
   POST /api/reviews/product/:productId
   AUTHENTICATED USER
========================================= */

const createReview = async (
  productId,
  data
) => {
  const response = await api.post(
    `/reviews/product/${productId}`,
    data
  );

  return response.data;
};


/* =========================================
   UPDATE REVIEW
   PUT /api/reviews/:reviewId
   AUTHENTICATED USER
========================================= */

const updateReview = async (
  reviewId,
  data
) => {
  const response = await api.put(
    `/reviews/${reviewId}`,
    data
  );

  return response.data;
};


/* =========================================
   DELETE REVIEW
   DELETE /api/reviews/:reviewId
   AUTHENTICATED USER
========================================= */

const deleteReview = async (reviewId) => {
  const response = await api.delete(
    `/reviews/${reviewId}`
  );

  return response.data;
};


/* =========================================
   REVIEW SERVICE
========================================= */

const reviewService = {
  getProductReviews,
  createReview,
  updateReview,
  deleteReview,
};


export default reviewService;