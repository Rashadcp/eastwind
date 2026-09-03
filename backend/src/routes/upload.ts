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
    const allowedExtensions = /jpeg|jpg|png|webp|gif|svg|mp4|webm|mov|mkv|avi/;
    const extName = allowedExtensions.test(path.extname(file.originalname).toLowerCase());
    const mimeType = allowedExtensions.test(file.mimetype.toLowerCase()) || file.mimetype.startsWith("image/") || file.mimetype.startsWith("video/");

    if (extName || mimeType) {
      return cb(null, true);
    }
    cb(new Error("Only image and video files (.png, .jpg, .jpeg, .webp, .svg, .mp4, .webm, .mov) are allowed!"));
  }
});

// Use upload.any() to handle both 'file' and 'image' field names seamlessly
router.post("/", requireAdmin, upload.any(), UploadController.handleUpload);

export default router;
