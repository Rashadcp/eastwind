import { Request, Response, NextFunction } from "express";
import fs from "fs";
import path from "path";
import sharp from "sharp";
import { UPLOAD_DIR } from "../config.js";

export class UploadController {
  static async handleUpload(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const uploadedFile = req.file || (req.files && (req.files as Express.Multer.File[])[0]);

      if (!uploadedFile || !uploadedFile.buffer) {
        res.status(400).json({ error: "No valid image file (.png, .jpg, .jpeg, .webp, .svg) provided." });
        return;
      }

      if (!fs.existsSync(UPLOAD_DIR)) {
        fs.mkdirSync(UPLOAD_DIR, { recursive: true });
      }

      const timestamp = Date.now();
      const baseName = path.parse(uploadedFile.originalname).name.replace(/[^a-zA-Z0-9_-]/g, "_");
      const isSvg = uploadedFile.mimetype.includes("svg") || uploadedFile.originalname.toLowerCase().endsWith(".svg");

      let finalFilename: string;
      let finalBuffer: Buffer;

      if (isSvg) {
        // Preserve vector SVGs as-is
        finalFilename = `${timestamp}-${baseName}.svg`;
        finalBuffer = uploadedFile.buffer;
      } else {
        // Compress & convert bitmap images to WebP (max width 1920px, quality 82)
        finalFilename = `${timestamp}-${baseName}.webp`;
        finalBuffer = await sharp(uploadedFile.buffer)
          .resize({ width: 1920, withoutEnlargement: true })
          .webp({ quality: 82, effort: 4 })
          .toBuffer();
      }

      const filePath = path.join(UPLOAD_DIR, finalFilename);
      fs.writeFileSync(filePath, finalBuffer);

      const originalKb = (uploadedFile.size / 1024).toFixed(1);
      const compressedKb = (finalBuffer.length / 1024).toFixed(1);
      const savedPct = uploadedFile.size > 0 
        ? (((uploadedFile.size - finalBuffer.length) / uploadedFile.size) * 100).toFixed(0) 
        : "0";

      console.log(`[Upload & Compress] ${uploadedFile.originalname} (${originalKb} KB) -> ${finalFilename} (${compressedKb} KB, -${savedPct}%)`);

      const fileUrl = `/uploads/${finalFilename}`;

      res.status(201).json({
        url: fileUrl,
        imageUrl: fileUrl,
        filename: finalFilename,
        originalName: uploadedFile.originalname,
        originalSizeKb: `${originalKb} KB`,
        compressedSizeKb: `${compressedKb} KB`,
        reduction: `${savedPct}%`
      });
    } catch (error) {
      console.error("[Upload Processing Error]", error);
      next(error);
    }
  }
}
