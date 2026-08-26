import api from "./api";

/* =========================================
   CREATE ORDER
   POST /api/orders
   AUTHENTICATED USER
========================================= */

const createOrder = async (data) => {
  const response = await api.post(
    "/orders",
    data
  );

  return response.data;
};


/* =========================================
   GET MY ORDERS
   GET /api/orders/my-orders
   AUTHENTICATED USER
========================================= */

const getMyOrders = async (params = {}) => {
  const response = await api.get(
    "/orders/my-orders",
    {
      params,
    }
  );

  return response.data;
};


/* =========================================
   GET SINGLE ORDER
   GET /api/orders/:id
   AUTHENTICATED USER / ADMIN
========================================= */

const getOrderById = async (id) => {
  const response = await api.get(
    `/orders/${id}`
  );

  return response.data;
};


/* =========================================
   GET ALL ORDERS
   GET /api/orders
   ADMIN ONLY
========================================= */

const getAllOrders = async (params = {}) => {
  const response = await api.get(
    "/orders",
    {
      params,
    }
  );

  return response.data;
};


/* =========================================
   UPDATE ORDER STATUS
   PATCH /api/orders/:id/status
   ADMIN ONLY
========================================= */

const updateOrderStatus = async (id, data) => {
  const response = await api.patch(
    `/orders/${id}/status`,
    data
  );

  return response.data;
};


/* =========================================
   ORDER SERVICE
========================================= */

const orderService = {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
};


export default orderService;