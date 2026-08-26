import api from "./api";

/* =========================================
   GET CART
   GET /api/cart
   AUTHENTICATED USER
========================================= */

const getCart = async () => {
  const response = await api.get("/cart");

  return response.data;
};


/* =========================================
   ADD TO CART
   POST /api/cart
   AUTHENTICATED USER
========================================= */

const addToCart = async (data) => {
  const response = await api.post(
    "/cart",
    data
  );

  return response.data;
};


/* =========================================
   UPDATE CART ITEM
   PUT /api/cart/:productId
   AUTHENTICATED USER
========================================= */

const updateCartItem = async (productId, data) => {
  const response = await api.put(
    `/cart/${productId}`,
    data
  );

  return response.data;
};


/* =========================================
   REMOVE FROM CART
   DELETE /api/cart/:productId
   AUTHENTICATED USER
========================================= */

const removeFromCart = async (productId) => {
  const response = await api.delete(
    `/cart/${productId}`
  );

  return response.data;
};


/* =========================================
   CLEAR CART
   DELETE /api/cart
   AUTHENTICATED USER
========================================= */

const clearCart = async () => {
  const response = await api.delete(
    "/cart"
  );

  return response.data;
};


/* =========================================
   CART SERVICE
========================================= */

const cartService = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
};

export default cartService;

