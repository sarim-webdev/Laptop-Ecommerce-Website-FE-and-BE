import api from "./api";


/* =========================================
   DASHBOARD
========================================= */

/**
 * Get admin dashboard statistics
 * GET /api/admin/dashboard
 */
const getDashboardStats = async () => {
  const response = await api.get(
    "/admin/dashboard"
  );

  return response.data;
};


/* =========================================
   USERS
========================================= */

/**
 * Get all users
 * GET /api/admin/users
 */
const getAllUsers = async (params = {}) => {
  const response = await api.get(
    "/admin/users",
    {
      params,
    }
  );

  return response.data;
};


/**
 * Get recent users
 * GET /api/admin/users/recent
 */
const getRecentUsers = async (params = {}) => {
  const response = await api.get(
    "/admin/users/recent",
    {
      params,
    }
  );

  return response.data;
};


/**
 * Get single user
 * GET /api/admin/users/:id
 */
const getUserById = async (id) => {
  const response = await api.get(
    `/admin/users/${id}`
  );

  return response.data;
};


/**
 * Update user role
 * PATCH /api/admin/users/:id/role
 *
 * data:
 * {
 *   role: "admin"
 * }
 */
const updateUserRole = async (id, data) => {
  const response = await api.patch(
    `/admin/users/${id}/role`,
    data
  );

  return response.data;
};


/**
 * Update user status
 * PATCH /api/admin/users/:id/status
 *
 * data:
 * {
 *   isActive: true
 * }
 */
const updateUserStatus = async (id, data) => {
  const response = await api.patch(
    `/admin/users/${id}/status`,
    data
  );

  return response.data;
};


/**
 * Delete user
 * DELETE /api/admin/users/:id
 */
const deleteUser = async (id) => {
  const response = await api.delete(
    `/admin/users/${id}`
  );

  return response.data;
};


/* =========================================
   PRODUCTS
========================================= */

/**
 * Get low stock products
 * GET /api/admin/products/low-stock
 */
const getLowStockProducts = async (params = {}) => {
  const response = await api.get(
    "/admin/products/low-stock",
    {
      params,
    }
  );

  return response.data;
};


/* =========================================
   ADMIN SERVICE
========================================= */

const adminService = {
  // Dashboard
  getDashboardStats,

  // Users
  getAllUsers,
  getRecentUsers,
  getUserById,
  updateUserRole,
  updateUserStatus,
  deleteUser,

  // Products
  getLowStockProducts,
};


export default adminService;

