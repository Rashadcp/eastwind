import { Request, Response, NextFunction } from "express";
import { AboutModel } from "../models/about.model.js";

export class AboutController {
  static async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const items = await AboutModel.getAll();
      res.json(items);
    } catch (error) {
      next(error);
    }
  }

  static async getBySection(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { section } = req.params;
      const item = await AboutModel.getBySection(section);
      if (!item) {
        res.status(404).json({ error: `About section '${section}' not found` });
        return;
      }
      res.json(item);
    } catch (error) {
      next(error);
    }
  }

  static async updateSection(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { section } = req.params;
      const updated = await AboutModel.upsertSection(section, req.body);
      res.json(updated);
    } catch (error) {
      next(error);
    }
  }
}
