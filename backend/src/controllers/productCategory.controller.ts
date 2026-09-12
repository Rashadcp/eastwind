import { Request, Response, NextFunction } from "express";
import { ProductCategoryModel } from "../models/productCategory.model.js";

export class ProductCategoryController {
  static async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const items = await ProductCategoryModel.getAll();
      res.json(items);
    } catch (error) {
      next(error);
    }
  }

  static async saveOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const categories = req.body.categories || req.body;
      const updated = await ProductCategoryModel.saveOrder(categories);
      res.json(updated);
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { name } = req.body;
      if (!name) {
        res.status(400).json({ error: "Category name is required" });
        return;
      }
      const created = await ProductCategoryModel.create(name);
      res.status(201).json(created);
    } catch (error: any) {
      if (error.message?.includes("already exists")) {
        res.status(400).json({ error: error.message });
        return;
      }
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const idOrName = req.params.id;
      const { name } = req.body;
      if (!name) {
        res.status(400).json({ error: "Category name is required" });
        return;
      }
      const updated = await ProductCategoryModel.update(idOrName, name);
      res.json(updated);
    } catch (error: any) {
      if (error.message?.includes("not found")) {
        res.status(404).json({ error: error.message });
        return;
      }
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const idOrName = req.params.id;
      const deleted = await ProductCategoryModel.delete(idOrName);
      res.json(deleted);
    } catch (error: any) {
      if (error.message?.includes("not found")) {
        res.status(404).json({ error: error.message });
        return;
      }
      next(error);
    }
  }
}
