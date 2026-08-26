import cloudinary from "../config/cloudinary.js";

/* =========================================
   UPLOAD SINGLE IMAGE
========================================= */

export const uploadImage = async (
  fileBuffer,
  folder = "nexora/products"
) => {
  try {
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: "image",
          transformation: [
            {
              width: 1200,
              height: 1200,
              crop: "limit",
              quality: "auto",
              fetch_format: "auto",
            },
          ],
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );

      uploadStream.end(fileBuffer);
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
  fileBuffers,
  folder = "nexora/products"
) => {
  try {
    const uploadPromises = fileBuffers.map((fileBuffer) =>
      uploadImage(fileBuffer, folder)
    );

    return await Promise.all(uploadPromises);
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

    if (
      result.result !== "ok" &&
      result.result !== "not found"
    ) {
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