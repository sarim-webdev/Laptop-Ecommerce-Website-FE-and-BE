/* =========================================
   APP
========================================= */

export const APP_NAME = "NEXORA";

export const APP_DESCRIPTION =
  "Premium laptops and technology for modern professionals.";

export const CURRENCY = "USD";

export const DEFAULT_PAGE_SIZE = 12;


/* =========================================
   API
========================================= */

export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5500/api";


/* =========================================
   ORDER STATUS
========================================= */

export const ORDER_STATUS = {
  PROCESSING: "Processing",
  CONFIRMED: "Confirmed",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};


/* =========================================
   PAYMENT STATUS
========================================= */

export const PAYMENT_STATUS = {
  PENDING: "Pending",
  PAID: "Paid",
  FAILED: "Failed",
};


/* =========================================
   PAYMENT METHODS
========================================= */

export const PAYMENT_METHODS = {
  COD: "COD",
  ONLINE: "ONLINE",
};


/* =========================================
   USER ROLES
========================================= */

export const USER_ROLES = {
  USER: "user",
  ADMIN: "admin",
};


/* =========================================
   PRODUCT
========================================= */

export const MAX_PRODUCT_IMAGES = 5;

export const LOW_STOCK_THRESHOLD = 5;


/* =========================================
   PAGINATION
========================================= */

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  PRODUCTS_PER_PAGE: 12,
  ORDERS_PER_PAGE: 10,
  USERS_PER_PAGE: 10,
};


/* =========================================
   ROUTES
========================================= */

export const ROUTES = {
  HOME: "/",
  PRODUCTS: "/products",
  CONTACT: "/contact",

  SIGN_IN: "/sign-in",
  SIGN_UP: "/sign-up",
  FORGOT_PASSWORD: "/forgot-password",

  PROFILE: "/profile",
  CART: "/cart",
  ORDERS: "/orders",

  ADMIN: "/admin",
  ADMIN_USERS: "/admin/users",
  ADMIN_PRODUCTS: "/admin/products",
  ADMIN_ORDERS: "/admin/orders",
  ADMIN_CATEGORIES: "/admin/categories",
  ADMIN_CONTACTS: "/admin/contacts",
};


/* =========================================
   STORAGE KEYS
========================================= */

export const STORAGE_KEYS = {
  USER: "user",
  TOKEN: "token",
};