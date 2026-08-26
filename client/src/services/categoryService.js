import api from "./api";

/* =========================================
   GET ALL CATEGORIES
   GET /api/categories
   PUBLIC
========================================= */

const getAllCategories = async () => {
  const response = await api.get("/categories");

  return response.data;
};


/* =========================================
   GET CATEGORY PRODUCTS
   GET /api/categories/:id/products
   PUBLIC
========================================= */

const getCategoryProducts = async (id, params = {}) => {
  const response = await api.get(
    `/categories/${id}/products`,
    {
      params,
    }
  );

  return response.data;
};


/* =========================================
   GET SINGLE CATEGORY
   GET /api/categories/:id
   PUBLIC
========================================= */

const getCategoryById = async (id) => {
  const response = await api.get(
    `/categories/${id}`
  );

  return response.data;
};


/* =========================================
   CREATE CATEGORY
   POST /api/categories
   ADMIN ONLY
========================================= */

const createCategory = async (data) => {
  const response = await api.post(
    "/categories",
    data
  );

  return response.data;
};


/* =========================================
   UPDATE CATEGORY
   PUT /api/categories/:id
   ADMIN ONLY
========================================= */

const updateCategory = async (id, data) => {
  const response = await api.put(
    `/categories/${id}`,
    data
  );

  return response.data;
};


/* =========================================
   DELETE CATEGORY
   DELETE /api/categories/:id
   ADMIN ONLY
========================================= */

const deleteCategory = async (id) => {
  const response = await api.delete(
    `/categories/${id}`
  );

  return response.data;
};


/* =========================================
   CATEGORY SERVICE
========================================= */

const categoryService = {
  getAllCategories,
  getCategoryProducts,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};

export default categoryService;