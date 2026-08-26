import api from "./api";

/* =========================================
   GET PROFILE
   GET /api/users/profile
   AUTHENTICATED USER
========================================= */

const getProfile = async () => {
  const response = await api.get("/users/profile");

  return response.data;
};


/* =========================================
   UPDATE PROFILE
   PATCH /api/users/profile
   AUTHENTICATED USER
========================================= */

const updateProfile = async (data) => {
  const response = await api.patch(
    "/users/profile",
    data
  );

  return response.data;
};


/* =========================================
   CHANGE PASSWORD
   PATCH /api/users/change-password
   AUTHENTICATED USER
========================================= */

const changePassword = async (data) => {
  const response = await api.patch(
    "/users/change-password",
    data
  );

  return response.data;
};


/* =========================================
   UPLOAD AVATAR
   PATCH /api/users/avatar
   AUTHENTICATED USER
========================================= */

const uploadAvatar = async (formData) => {
  const response = await api.patch(
    "/users/avatar",
    formData
  );

  return response.data;
};


/* =========================================
   DELETE AVATAR
   DELETE /api/users/avatar
   AUTHENTICATED USER
========================================= */

const deleteAvatar = async () => {
  const response = await api.delete(
    "/users/avatar"
  );

  return response.data;
};


/* =========================================
   USER SERVICE
========================================= */

const userService = {
  getProfile,
  updateProfile,
  changePassword,
  uploadAvatar,
  deleteAvatar,
};

export default userService;
