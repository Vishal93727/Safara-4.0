// src/controllers/uploadController.js
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";
import { logger } from "../utils/logger.js";

// ✅ Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ----------------------
// Upload Single File
// ----------------------
export const uploadSingle = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "uploads",
    });

    // Delete local temp file after upload
    fs.unlinkSync(req.file.path);

    logger.info(`File uploaded: ${result.public_id}`);
    res.status(201).json({
  message: "File uploaded successfully",
  file: {
    url: result.secure_url,
    publicId: result.public_id,
  },
});
    
  } catch (error) {
    logger.error("Upload single error:", error);
    next(error);
  }
};

// ----------------------
// Upload Multiple Files
// ----------------------
export const uploadMultiple = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const uploads = await Promise.all(
      req.files.map(async (file) => {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "uploads",
        });
        fs.unlinkSync(file.path);
        return {
          url: result.secure_url,
          publicId: result.public_id,
        };
      })
    );

    logger.info(`Multiple files uploaded: ${uploads.length}`);
    res.status(201).json({
  message: "Files uploaded successfully",
  files: uploads,
});
  } catch (error) {
    logger.error("Upload multiple error:", error);
    next(error);
  }
};

// ----------------------
// Get File by Public ID
// ----------------------
export const getUpload = async (req, res, next) => {
  try {
    const { publicId } = req.params;

    // Construct Cloudinary URL directly
    const url = cloudinary.url(publicId, { secure: true });

    res.status(200).json({
      message: "File retrieved successfully",
      file: { publicId, url },
    });
  } catch (error) {
    logger.error("Get upload error:", error);
    next(error);
  }
};

// ----------------------
// Delete File by Public ID
// ----------------------
export const deleteUpload = async (req, res, next) => {
  try {
    const { publicId } = req.params;

    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result !== "ok") {
      return res.status(404).json({ message: "File not found or already deleted" });
    }

    logger.info(`File deleted: ${publicId}`);
    res.status(200).json({
      message: "File deleted successfully",
      publicId,
    });
  } catch (error) {
    logger.error("Delete upload error:", error);
    next(error);
  }
};