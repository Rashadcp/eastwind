import { Request, Response, NextFunction } from "express";
import { SuccessStoryModel } from "../models/successStory.model.js";

export class SuccessStoryController {
  static async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const items = await SuccessStoryModel.getAll();
      res.json(items);
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const item = await SuccessStoryModel.getById(req.params.id);
      if (!item) {
        res.status(404).json({ error: "Success story not found" });
        return;
      }
      res.json(item);
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const created = await SuccessStoryModel.create(req.body);
      res.status(201).json(created);
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const updated = await SuccessStoryModel.update(req.params.id, req.body);
      if (!updated) {
        res.status(404).json({ error: "Success story not found to update" });
        return;
      }
      res.json(updated);
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const deleted = await SuccessStoryModel.delete(req.params.id);
      if (!deleted) {
        res.status(404).json({ error: "Success story not found to delete" });
        return;
      }
      res.json(deleted);
    } catch (error) {
      next(error);
    }
  }
}
