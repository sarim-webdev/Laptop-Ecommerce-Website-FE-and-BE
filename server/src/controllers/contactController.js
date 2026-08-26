import Contact from "../models/Contact.js";
import mongoose from "mongoose";
import { successResponse, errorResponse } from "../utils/apiResponse.js";

/* =========================================
   CREATE CONTACT MESSAGE
   POST /api/contacts
   PUBLIC
========================================= */

export const createContact = async (req, res, next) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    /* =========================================
       BASIC VALIDATION
    ========================================= */

    if (!name || !name.trim()) {
      return errorResponse(res, 400, "Name is required.");
    }

    if (!email || !email.trim()) {
      return errorResponse(res, 400, "Email is required.");
    }

    if (!subject || !subject.trim()) {
      return errorResponse(res, 400, "Subject is required.");
    }

    if (!message || !message.trim()) {
      return errorResponse(res, 400, "Message is required.");
    }

    /* =========================================
       EMAIL FORMAT VALIDATION
    ========================================= */

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email.trim())) {
      return errorResponse(res, 400, "Please provide a valid email address.");
    }

    /* =========================================
       CREATE CONTACT MESSAGE
    ========================================= */

    const contact = await Contact.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone?.trim() || "",
      subject: subject.trim(),
      message: message.trim(),
      status: "New",
    });

    /* =========================================
       RESPONSE
    ========================================= */

    return successResponse(
      res,
      201,
      "Your message has been sent successfully. We will get back to you soon.",
      contact,
    );
  } catch (error) {
    next(error);
  }
};

/* =========================================
   GET ALL CONTACT MESSAGES
   GET /api/contacts
   ADMIN ONLY
========================================= */

export const getContacts = async (req, res, next) => {
  try {
    /* =========================================
       PAGINATION
    ========================================= */

    const page = Math.max(Number(req.query.page) || 1, 1);

    const limit = Math.min(Number(req.query.limit) || 20, 100);

    const skip = (page - 1) * limit;

    /* =========================================
       SEARCH
    ========================================= */

    const search = req.query.search?.trim();

    const filter = {};

    if (search) {
      filter.$or = [
        {
          name: {
            $regex: search,
            $options: "i",
          },
        },
        {
          email: {
            $regex: search,
            $options: "i",
          },
        },
        {
          subject: {
            $regex: search,
            $options: "i",
          },
        },
        {
          message: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    /* =========================================
       STATUS FILTER
    ========================================= */

    if (req.query.status) {
      filter.status = req.query.status;
    }

    /* =========================================
       FETCH CONTACTS
    ========================================= */

    const [contacts, totalContacts] = await Promise.all([
      Contact.find(filter)
        .sort({
          createdAt: -1,
        })
        .skip(skip)
        .limit(limit),

      Contact.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalContacts / limit);

    /* =========================================
       RESPONSE
    ========================================= */

    return successResponse(
      res,
      200,
      "Contact messages retrieved successfully.",
      {
        contacts,

        pagination: {
          currentPage: page,
          totalPages,
          totalContacts,
          limit,

          hasNextPage: page < totalPages,

          hasPreviousPage: page > 1,
        },
      },
    );
  } catch (error) {
    next(error);
  }
};

/* =========================================
   GET SINGLE CONTACT
   GET /api/contacts/:id
   ADMIN ONLY
========================================= */

export const getContactById = async (req, res, next) => {
  try {
    const { id } = req.params;

    /* =========================================
         FIND CONTACT
      ========================================= */

    const contact = await Contact.findById(id);

    if (!contact) {
      return errorResponse(res, 404, "Contact message not found.");
    }

    /* =========================================
         RESPONSE
      ========================================= */

    return successResponse(
      res,
      200,
      "Contact message retrieved successfully.",
      contact,
    );
  } catch (error) {
    next(error);
  }
};

/* =========================================
   UPDATE CONTACT STATUS
   PATCH /api/contacts/:id/status
   ADMIN ONLY
========================================= */

export const updateContactStatus = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { status } = req.body;

    /* =========================================
         VALIDATE STATUS
      ========================================= */

    const allowedStatuses = ["New", "In Progress", "Resolved"];

    if (!status || !allowedStatuses.includes(status)) {
      return errorResponse(
        res,
        400,
        `Invalid status. Allowed statuses: ${allowedStatuses.join(", ")}.`,
      );
    }

    /* =========================================
         FIND CONTACT
      ========================================= */

    const contact = await Contact.findById(id);

    if (!mongoose.isValidObjectId(id)) {
  return errorResponse(
    res,
    400,
    "Invalid contact ID."
  );
}

    if (!contact) {
      return errorResponse(res, 404, "Contact message not found.");
    }

    /* =========================================
         UPDATE STATUS
      ========================================= */

    contact.status = status;

    if (status === "Resolved") {
      contact.repliedAt = new Date();
    }

    await contact.save();

    /* =========================================
         RESPONSE
      ========================================= */

    return successResponse(
      res,
      200,
      "Contact status updated successfully.",
      contact,
    );
  } catch (error) {
    next(error);
  }
};

/* =========================================
   DELETE CONTACT
   DELETE /api/contacts/:id
   ADMIN ONLY
========================================= */

export const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;

    /* =========================================
         FIND CONTACT
      ========================================= */

    const contact = await Contact.findById(id);

    if (!contact) {
      return errorResponse(res, 404, "Contact message not found.");
    }

    /* =========================================
         DELETE CONTACT
      ========================================= */

    await Contact.findByIdAndDelete(id);

    /* =========================================
         RESPONSE
      ========================================= */

    return successResponse(res, 200, "Contact message deleted successfully.");
  } catch (error) {
    next(error);
  }
};
