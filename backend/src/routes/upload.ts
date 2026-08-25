import { Router } from "express";
import multer from "multer";
import path from "path";
import { UploadController } from "../controllers/upload.controller.js";
import { requireAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

// In-memory buffer for Sharp image processing
const storage = multer.memoryStorage();

// Support PNG, JPG, JPEG, WEBP, GIF, SVG images up to 25MB
const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedExtensions = /jpeg|jpg|png|webp|gif|svg/;
    const extName = allowedExtensions.test(path.extname(file.originalname).toLowerCase());
    const mimeType = allowedExtensions.test(file.mimetype.toLowerCase()) || file.mimetype.startsWith("image/");

    if (extName || mimeType) {
      return cb(null, true);
    }
    cb(new Error("Only image files (.png, .jpg, .jpeg, .webp, .gif, .svg) are allowed!"));
  }
});

// Use upload.any() to handle both 'file' and 'image' field names seamlessly
router.post("/", requireAdmin, upload.any(), UploadController.handleUpload);

export default router;
