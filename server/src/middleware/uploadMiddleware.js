import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";

import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,

  params: async (req, file) => {
    const folder =
      req.uploadFolder === "profile"
        ? "nexora/profiles"
        : "nexora/products";

    return {
      folder,

      allowed_formats: ["jpg", "jpeg", "png", "webp"],

      transformation: [
        {
          width: 1200,
          height: 1200,
          crop: "limit",
          quality: "auto",
          fetch_format: "auto",
        },
      ],
    };
  },
});

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Invalid file type. Only JPG, JPEG, PNG and WEBP images are allowed."
      ),
      false
    );
  }
};

const upload = multer({
  storage,
  fileFilter,

  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 5,
  },
});

export default upload;