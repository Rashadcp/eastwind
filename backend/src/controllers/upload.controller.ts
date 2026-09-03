import { Request, Response, NextFunction } from "express";
import fs from "fs";
import path from "path";
import sharp from "sharp";
import ffmpegInstaller from "@ffmpeg-installer/ffmpeg";
import ffmpeg from "fluent-ffmpeg";
import { UPLOAD_DIR } from "../config.js";

// Limit libvips to 1 thread to prevent 100% CPU spikes in production
sharp.concurrency(1);

// Configure FFmpeg binary path
if (ffmpegInstaller && (ffmpegInstaller as any).path) {
  ffmpeg.setFfmpegPath((ffmpegInstaller as any).path);
}

function compressVideo(inputPath: string, outputPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .videoCodec("libx264")
      .audioCodec("aac")
      .outputOptions([
        "-crf 28",
        "-preset fast",
        "-movflags +faststart",
        "-pix_fmt yuv420p",
        "-vf scale='min(1920,iw)':-2"
      ])
      .on("end", () => resolve())
      .on("error", (err: any) => reject(err))
      .save(outputPath);
  });
}

export class UploadController {
  static async handleUpload(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const uploadedFile = req.file || (req.files && (req.files as Express.Multer.File[])[0]);

      if (!uploadedFile || !uploadedFile.buffer) {
        res.status(400).json({ error: "No valid image or video file provided." });
        return;
      }

      if (!fs.existsSync(UPLOAD_DIR)) {
        fs.mkdirSync(UPLOAD_DIR, { recursive: true });
      }

      const timestamp = Date.now();
      const baseName = path.parse(uploadedFile.originalname).name.replace(/[^a-zA-Z0-9_-]/g, "_");
      const isVideo = uploadedFile.mimetype.startsWith("video/") || /\.(mp4|webm|mov|mkv|avi)$/i.test(uploadedFile.originalname);
      const isSvg = uploadedFile.mimetype.includes("svg") || uploadedFile.originalname.toLowerCase().endsWith(".svg");

      // Sync directory for frontend dev
      const frontendUploadDir = path.resolve(process.cwd(), "../frontend/public/uploads");

      let finalFilename: string;

      if (isVideo) {
        // High-efficiency video compression: converts to fast-streaming web H.264/AAC with +faststart
        finalFilename = `${timestamp}-${baseName}.mp4`;
        const tempPath = path.join(UPLOAD_DIR, `temp-${timestamp}-${baseName}${path.extname(uploadedFile.originalname)}`);
        const finalPath = path.join(UPLOAD_DIR, finalFilename);

        fs.writeFileSync(tempPath, uploadedFile.buffer);

        try {
          console.log(`[Video Upload] Compressing ${uploadedFile.originalname} with FFmpeg...`);
          await compressVideo(tempPath, finalPath);
          if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
        } catch (videoErr) {
          console.warn("[Video Compression Warning] FFmpeg compression issue, saving direct file:", videoErr);
          if (fs.existsSync(tempPath)) {
            fs.renameSync(tempPath, finalPath);
          } else {
            fs.writeFileSync(finalPath, uploadedFile.buffer);
          }
        }

        // Copy to frontend public uploads for local parity
        try {
          if (fs.existsSync(frontendUploadDir)) {
            fs.copyFileSync(finalPath, path.join(frontendUploadDir, finalFilename));
          }
        } catch (e) {
          // ignore
        }

        const finalStats = fs.statSync(finalPath);
        const originalKb = (uploadedFile.size / 1024).toFixed(1);
        const compressedKb = (finalStats.size / 1024).toFixed(1);
        const savedPct = uploadedFile.size > 0 
          ? (((uploadedFile.size - finalStats.size) / uploadedFile.size) * 100).toFixed(0) 
          : "0";

        console.log(`[Upload & Compress Video] ${uploadedFile.originalname} (${originalKb} KB) -> ${finalFilename} (${compressedKb} KB, -${savedPct}%)`);

        const fileUrl = `/uploads/${finalFilename}`;
        res.status(201).json({
          url: fileUrl,
          imageUrl: fileUrl,
          videoUrl: fileUrl,
          filename: finalFilename,
          originalName: uploadedFile.originalname,
          originalSizeKb: `${originalKb} KB`,
          compressedSizeKb: `${compressedKb} KB`,
          reduction: `${savedPct}%`,
          isVideo: true
        });
        return;
      }

      let finalBuffer: Buffer;

      if (isSvg) {
        // Preserve vector SVGs as-is
        finalFilename = `${timestamp}-${baseName}.svg`;
        finalBuffer = uploadedFile.buffer;
      } else {
        // High-fidelity image compression: preserves pristine visual detail while shrinking file size 70-85%
        finalFilename = `${timestamp}-${baseName}.webp`;
        finalBuffer = await sharp(uploadedFile.buffer)
          .resize({ width: 2048, height: 2048, fit: "inside", withoutEnlargement: true })
          .webp({ quality: 86, effort: 4, smartSubsample: true })
          .toBuffer();
      }

      const filePath = path.join(UPLOAD_DIR, finalFilename);
      fs.writeFileSync(filePath, finalBuffer);

      // Copy to frontend public uploads for local parity
      try {
        if (fs.existsSync(frontendUploadDir)) {
          fs.writeFileSync(path.join(frontendUploadDir, finalFilename), finalBuffer);
        }
      } catch (e) {
        // ignore
      }

      const originalKb = (uploadedFile.size / 1024).toFixed(1);
      const compressedKb = (finalBuffer.length / 1024).toFixed(1);
      const savedPct = uploadedFile.size > 0 
        ? (((uploadedFile.size - finalBuffer.length) / uploadedFile.size) * 100).toFixed(0) 
        : "0";

      console.log(`[Upload & Compress Image] ${uploadedFile.originalname} (${originalKb} KB) -> ${finalFilename} (${compressedKb} KB, -${savedPct}%)`);

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
