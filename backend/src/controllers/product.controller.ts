import { Request, Response, NextFunction } from "express";
import { ProductModel } from "../models/product.model.js";
import { ProductPageModel } from "../models/productPage.model.js";

export class ProductController {
  static async getPageSettings(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const settings = await ProductPageModel.get();
      res.json(settings);
    } catch (error) {
      next(error);
    }
  }

  static async updatePageSettings(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { title } = req.body;
      const updated = await ProductPageModel.update(title);
      res.json(updated);
    } catch (error) {
      next(error);
    }
  }
  static async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const items = await ProductModel.getAll();
      res.json(items);
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (req.params.id === "reorder") {
        res.status(404).json({ error: "Product not found" });
        return;
      }
      const item = await ProductModel.getById(req.params.id);
      if (!item) {
        res.status(404).json({ error: "Product not found" });
        return;
      }
      res.json(item);
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const created = await ProductModel.create(req.body);
      res.status(201).json(created);
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (req.params.id === "reorder") {
        return ProductController.reorder(req, res, next);
      }
      const updated = await ProductModel.update(req.params.id, req.body);
      if (!updated) {
        res.status(404).json({ error: "Product not found to update" });
        return;
      }
      res.json(updated);
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const deleted = await ProductModel.delete(req.params.id);
      if (!deleted) {
        res.status(404).json({ error: "Product not found to delete" });
        return;
      }
      res.json(deleted);
    } catch (error) {
      next(error);
    }
  }

  static async reorder(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const items = Array.isArray(req.body) ? req.body : req.body?.items;
      if (!Array.isArray(items)) {
        res.status(400).json({ error: "Invalid payload: array of items required" });
        return;
      }
      await ProductModel.reorder(items);
      res.json({ success: true, count: items.length });
    } catch (error) {
      next(error);
    }
  }
}
