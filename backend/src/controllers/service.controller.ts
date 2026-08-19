import { Request, Response, NextFunction } from "express";
import { ServiceModel } from "../models/service.model.js";

export class ServiceController {
  static async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const items = await ServiceModel.getAll();
      res.json(items);
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const item = await ServiceModel.getById(req.params.id);
      if (!item) {
        res.status(404).json({ error: "Service not found" });
        return;
      }
      res.json(item);
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const created = await ServiceModel.create(req.body);
      res.status(201).json(created);
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const updated = await ServiceModel.update(req.params.id, req.body);
      if (!updated) {
        res.status(404).json({ error: "Service not found to update" });
        return;
      }
      res.json(updated);
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const deleted = await ServiceModel.delete(req.params.id);
      if (!deleted) {
        res.status(404).json({ error: "Service not found to delete" });
        return;
      }
      res.json(deleted);
    } catch (error) {
      next(error);
    }
  }
}
