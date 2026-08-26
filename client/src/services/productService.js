import api from "./api";


/* =========================================
   GET ALL PRODUCTS
   GET /api/products
   PUBLIC
========================================= */

const getProducts = async (params = {}) => {
  const response = await api.get(
    "/products",
    {
      params,
    }
  );

  return response.data;
};


/* =========================================
   GET SINGLE PRODUCT
   GET /api/products/:id
   PUBLIC
========================================= */

const getProductById = async (id) => {
  const response = await api.get(
    `/products/${id}`
  );

  return response.data;
};


/* =========================================
   CREATE PRODUCT
   POST /api/products
   ADMIN ONLY
========================================= */

const createProduct = async (formData) => {
  const response = await api.post(
    "/products",
    formData
  );

  return response.data;
};


/* =========================================
   UPDATE PRODUCT
   PUT /api/products/:id
   ADMIN ONLY
========================================= */

const updateProduct = async (id, formData) => {
  const response = await api.put(
    `/products/${id}`,
    formData
  );

  return response.data;
};


/* =========================================
   DELETE PRODUCT
   DELETE /api/products/:id
   ADMIN ONLY
========================================= */

const deleteProduct = async (id) => {
  const response = await api.delete(
    `/products/${id}`
  );

  return response.data;
};


/* =========================================
   PRODUCT SERVICE
========================================= */

const productService = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};


export default productService;