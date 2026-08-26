import cloudinary from "../config/cloudinary.js";

/* =========================================
   UPLOAD SINGLE IMAGE
========================================= */

export const uploadImage = async (
  filePath,
  folder = "nexora/products"
) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder,
      resource_type: "image",
    });

    return {
      publicId: result.public_id,
      url: result.secure_url,
      width: result.width,
      height: result.height,
      format: result.format,
    };
  } catch (error) {
    console.error("❌ Cloudinary upload failed:", error.message);

    throw new Error("Image upload failed");
  }
};

/* =========================================
   UPLOAD MULTIPLE IMAGES
========================================= */

export const uploadMultipleImages = async (
  filePaths,
  folder = "nexora/products"
) => {
  try {
    const uploadPromises = filePaths.map((filePath) =>
      uploadImage(filePath, folder)
    );

    const results = await Promise.all(uploadPromises);

    return results;
  } catch (error) {
    console.error(
      "❌ Multiple image upload failed:",
      error.message
    );

    throw new Error("Images upload failed");
  }
};

/* =========================================
   DELETE IMAGE
========================================= */

export const deleteImage = async (publicId) => {
  try {
    if (!publicId) {
      throw new Error("Cloudinary public ID is required");
    }

    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result !== "ok" && result.result !== "not found") {
      throw new Error("Cloudinary image deletion failed");
    }

    return result;
  } catch (error) {
    console.error(
      "❌ Cloudinary delete failed:",
      error.message
    );

    throw new Error("Image deletion failed");
  }
};