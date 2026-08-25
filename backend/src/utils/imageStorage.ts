import fs from "fs";
import path from "path";
import sharp from "sharp";
import { UPLOAD_DIR } from "../config.js";

/**
 * Automatically detects and extracts base64 data URIs into compressed static files on disk.
 * Returns the public URL (/uploads/filename.ext) or the original string if not base64.
 */
export function extractAndSaveBase64(value: any, prefix = "img"): any {
  if (typeof value !== "string" || !value.startsWith("data:image/")) {
    return value;
  }

  try {
    const matches = value.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
    if (!matches || matches.length < 3) {
      return value;
    }

    const rawExt = matches[1].toLowerCase();
    const base64Data = matches[2];
    const buffer = Buffer.from(base64Data, "base64");

    if (!fs.existsSync(UPLOAD_DIR)) {
      fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    }

    const cleanPrefix = prefix.replace(/[^a-zA-Z0-9_-]/g, "_");
    const uniqueId = `${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    if (rawExt.includes("svg")) {
      const filename = `${cleanPrefix}_${uniqueId}.svg`;
      const filePath = path.join(UPLOAD_DIR, filename);
      fs.writeFileSync(filePath, buffer);
      return `/uploads/${filename}`;
    }

    // Compress & convert bitmap images to WebP
    const filename = `${cleanPrefix}_${uniqueId}.webp`;
    const filePath = path.join(UPLOAD_DIR, filename);

    // Run Sharp synchronously / asynchronously
    sharp(buffer)
      .resize({ width: 1920, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toBuffer()
      .then((compressedBuffer) => {
        fs.writeFileSync(filePath, compressedBuffer);
        console.log(`[Auto-Extracted & Compressed] Saved ${filename} (${(compressedBuffer.length / 1024).toFixed(1)} KB)`);
      })
      .catch((err) => {
        console.error("[Sharp Compression Fallback]", err);
        fs.writeFileSync(filePath, buffer);
      });

    return `/uploads/${filename}`;
  } catch (err) {
    console.error("[Auto-Extract Base64 Error]", err);
    return value;
  }
}

/**
 * Recursively scans an object or array and extracts any base64 image strings found.
 */
export function sanitizeObjectImages(obj: any, prefix = "asset"): any {
  if (!obj || typeof obj !== "object") return obj;

  if (Array.isArray(obj)) {
    return obj.map((item, idx) => sanitizeObjectImages(item, `${prefix}_${idx}`));
  }

  const result: any = { ...obj };
  for (const key of Object.keys(result)) {
    const val = result[key];
    if (typeof val === "string" && val.startsWith("data:image/")) {
      result[key] = extractAndSaveBase64(val, `${prefix}_${key}`);
    } else if (typeof val === "object" && val !== null) {
      result[key] = sanitizeObjectImages(val, `${prefix}_${key}`);
    }
  }
  return result;
}
