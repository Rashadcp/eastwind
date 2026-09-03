import { Router } from "express";
import multer from "multer";
import path from "path";
import { UploadController } from "../controllers/upload.controller.js";
import { requireAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

// In-memory buffer for Sharp image processing
const storage = multer.memoryStorage();

// Support images and video files up to 150MB
const upload = multer({
  storage,
  limits: { fileSize: 150 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedExtensions = /jpeg|jpg|png|webp|gif|svg|mp4|webm|mov|mkv|avi|pdf|docx|doc|xls|xlsx|txt|csv|zip/;
    const extName = allowedExtensions.test(path.extname(file.originalname).toLowerCase());
    const isDocMime = file.mimetype.includes("pdf") ||
                      file.mimetype.includes("document") ||
                      file.mimetype.includes("msword") ||
                      file.mimetype.includes("officedocument") ||
                      file.mimetype.includes("text/") ||
                      file.mimetype.includes("application/zip") ||
                      file.mimetype.includes("application/octet-stream");
    const mimeType = allowedExtensions.test(file.mimetype.toLowerCase()) || 
                     file.mimetype.startsWith("image/") || 
                     file.mimetype.startsWith("video/") ||
                     isDocMime;

    if (extName || mimeType) {
      return cb(null, true);
    }
    cb(new Error("Only images, videos, and documents (.pdf, .docx, .doc, .png, .jpg, .webp, .mp4) are allowed!"));
  }
});

// Use upload.any() to handle both 'file' and 'image' field names seamlessly
router.post("/", requireAdmin, upload.any(), UploadController.handleUpload);

export default router;
