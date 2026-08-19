import { Request, Response, NextFunction } from "express";
import { BrandModel } from "../models/brand.model.js";

export class BrandController {
  static async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const items = await BrandModel.getAll();
      res.json(items);
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const item = await BrandModel.getById(req.params.id);
      if (!item) {
        res.status(404).json({ error: "Brand not found" });
        return;
      }
      res.json(item);
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const created = await BrandModel.create(req.body);
      res.status(201).json(created);
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const updated = await BrandModel.update(req.params.id, req.body);
      if (!updated) {
        res.status(404).json({ error: "Brand not found to update" });
        return;
      }
      res.json(updated);
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const deleted = await BrandModel.delete(req.params.id);
      if (!deleted) {
        res.status(404).json({ error: "Brand not found to delete" });
        return;
      }
      res.json(deleted);
    } catch (error) {
      next(error);
    }
  }
}
