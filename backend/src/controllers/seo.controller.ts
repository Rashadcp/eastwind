import { Request, Response, NextFunction } from "express";
import { SeoModel } from "../models/seo.model.js";

export class SeoController {
  static async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const items = await SeoModel.getAll();
      res.json(items);
    } catch (error) {
      next(error);
    }
  }

  static async getByPageKey(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { pageKey } = req.params;
      const item = await SeoModel.getByPageKey(pageKey);
      if (!item) {
        res.status(404).json({ error: `SEO configuration for '${pageKey}' not found` });
        return;
      }
      res.json(item);
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { pageKey } = req.params;
      const updated = await SeoModel.upsert(pageKey, req.body);
      res.json(updated);
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const created = await SeoModel.create(req.body);
      res.status(201).json(created);
    } catch (error: any) {
      if (error.message?.includes("already exists")) {
        res.status(400).json({ error: error.message });
        return;
      }
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { pageKey } = req.params;
      const CORE_PAGES = ["home", "about", "products", "solutions", "applications", "services", "contact", "privacy-policy"];
      if (CORE_PAGES.includes(pageKey.toLowerCase().trim())) {
        res.status(400).json({ error: `Cannot delete default core page '${pageKey}'. You can edit its metadata instead.` });
        return;
      }
      const deleted = await SeoModel.delete(pageKey);
      res.json({ message: "SEO configuration deleted successfully", deleted });
    } catch (error: any) {
      if (error.message?.includes("not found")) {
        res.status(404).json({ error: error.message });
        return;
      }
      next(error);
    }
  }
}
