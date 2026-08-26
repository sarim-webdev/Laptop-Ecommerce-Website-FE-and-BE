import api from "./api";


/* =========================================
   CREATE CONTACT MESSAGE
   POST /api/contact
   PUBLIC
========================================= */

const createContact = async (data) => {
  const response = await api.post(
    "/contact",
    data
  );

  return response.data;
};


/* =========================================
   GET ALL CONTACT MESSAGES
   GET /api/contact
   ADMIN ONLY
========================================= */

const getContacts = async (params = {}) => {
  const response = await api.get(
    "/contact",
    {
      params,
    }
  );

  return response.data;
};


/* =========================================
   GET SINGLE CONTACT MESSAGE
   GET /api/contact/:id
   ADMIN ONLY
========================================= */

const getContactById = async (id) => {
  const response = await api.get(
    `/contact/${id}`
  );

  return response.data;
};


/* =========================================
   UPDATE CONTACT STATUS
   PATCH /api/contact/:id/status
   ADMIN ONLY
========================================= */

const updateContactStatus = async (id, data) => {
  const response = await api.patch(
    `/contact/${id}/status`,
    data
  );

  return response.data;
};


/* =========================================
   DELETE CONTACT MESSAGE
   DELETE /api/contact/:id
   ADMIN ONLY
========================================= */

const deleteContact = async (id) => {
  const response = await api.delete(
    `/contact/${id}`
  );

  return response.data;
};


/* =========================================
   CONTACT SERVICE
========================================= */

const contactService = {
  createContact,
  getContacts,
  getContactById,
  updateContactStatus,
  deleteContact,
};


export default contactService;
