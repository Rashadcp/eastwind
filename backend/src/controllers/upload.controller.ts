import { Request, Response, NextFunction } from "express";

export class UploadController {
  static handleUpload(req: Request, res: Response, next: NextFunction): void {
    try {
      // Handle req.file or req.files from multer.any()
      const uploadedFile = req.file || (req.files && (req.files as Express.Multer.File[])[0]);

      if (!uploadedFile) {
        res.status(400).json({ error: "No valid image file (.png, .jpg, .jpeg, .webp) provided in upload request." });
        return;
      }
      
      const fileUrl = `/uploads/${uploadedFile.filename}`;
      console.log(`[Upload Success] File uploaded: ${uploadedFile.originalname} -> ${uploadedFile.filename}`);
      
      // Return both url and imageUrl for 100% frontend compatibility
      res.status(201).json({
        url: fileUrl,
        imageUrl: fileUrl,
        filename: uploadedFile.filename,
        originalName: uploadedFile.originalname
      });
    } catch (error) {
      next(error);
    }
  }
}
