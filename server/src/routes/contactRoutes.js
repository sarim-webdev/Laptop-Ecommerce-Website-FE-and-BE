import express from "express";

import {
  createContact,
  getContacts,
  getContactById,
  updateContactStatus,
  deleteContact,
} from "../controllers/contactController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

/* =========================================
   CREATE CONTACT MESSAGE
   Public
========================================= */

router.post(
  "/",
  createContact
);

/* =========================================
   GET ALL CONTACT MESSAGES
   Admin
========================================= */

router.get(
  "/",
  authMiddleware,
  adminMiddleware,
  getContacts
);

/* =========================================
   GET SINGLE CONTACT
   Admin
========================================= */

router.get(
  "/:id",
  authMiddleware,
  adminMiddleware,
  getContactById
);

/* =========================================
   UPDATE CONTACT STATUS
   Admin
========================================= */

router.patch(
  "/:id/status",
  authMiddleware,
  adminMiddleware,
  updateContactStatus
);

/* =========================================
   DELETE CONTACT
   Admin
========================================= */

router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  deleteContact
);

export default router;