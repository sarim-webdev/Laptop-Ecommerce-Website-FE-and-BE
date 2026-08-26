import api from "./api";

/* =========================================
   REGISTER
   POST /api/auth/register
========================================= */

const register = async (formData) => {
  const response = await api.post(
    "/auth/register",
    formData
  );

  return response.data;
};


/* =========================================
   LOGIN
   POST /api/auth/login
========================================= */

const login = async (data) => {
  const response = await api.post(
    "/auth/login",
    data
  );

  return response.data;
};


/* =========================================
   LOGOUT
   POST /api/auth/logout
========================================= */

const logout = async () => {
  const response = await api.post(
    "/auth/logout"
  );

  return response.data;
};


/* =========================================
   FORGOT PASSWORD
   POST /api/auth/forgot-password
========================================= */

const forgotPassword = async (data) => {
  const response = await api.post(
    "/auth/forgot-password",
    data
  );

  return response.data;
};


/* =========================================
   RESET PASSWORD
   POST /api/auth/reset-password/:token
========================================= */

const resetPassword = async (token, data) => {
  const response = await api.post(
    `/auth/reset-password/${token}`,
    data
  );

  return response.data;
};


/* =========================================
   AUTH SERVICE
========================================= */

const authService = {
  register,
  login,
  logout,
  forgotPassword,
  resetPassword,
};

export default authService;