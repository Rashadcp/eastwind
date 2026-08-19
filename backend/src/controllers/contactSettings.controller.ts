import { Request, Response, NextFunction } from "express";
import { ContactSettingsModel } from "../models/contact.model.js";

export class ContactSettingsController {
  static async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const items = await ContactSettingsModel.getAll();
      res.json(items);
    } catch (error) {
      next(error);
    }
  }

  static async getBySection(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { section } = req.params;
      const item = await ContactSettingsModel.getBySection(section);
      if (!item) {
        res.status(404).json({ error: `Contact settings section '${section}' not found` });
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
      const updated = await ContactSettingsModel.upsertSection(section, req.body);
      res.json(updated);
    } catch (error) {
      next(error);
    }
  }
}
