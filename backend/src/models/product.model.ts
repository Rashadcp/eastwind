import { Product, IProduct } from "../db.js";

import fs from "fs";
import path from "path";

export class ProductModel {
  static async getAll(): Promise<IProduct[]> {
    let items = await Product.find({}).exec();
    if (!items || items.length < 30) {
      try {
        const dbPath = path.join(process.cwd(), "database.json");
        if (fs.existsSync(dbPath)) {
          const raw = fs.readFileSync(dbPath, "utf-8");
          const seed = JSON.parse(raw);
          if (seed && Array.isArray(seed.products) && seed.products.length > 0) {
            for (const p of seed.products) {
              await Product.findOneAndUpdate({ id: p.id }, p, { upsert: true, new: true });
            }
            items = await Product.find({}).exec();
          }
        }
      } catch (e) {
        console.warn("Product seed sync warning:", e);
      }
    }
    return items;
  }

  static async getById(id: string): Promise<IProduct | null> {
    return await Product.findOne({ id }).exec();
  }

  static async create(data: Partial<IProduct>): Promise<IProduct> {
    return await Product.create(data);
  }

  static async update(id: string, updates: Partial<IProduct>): Promise<IProduct | null> {
    return await Product.findOneAndUpdate({ id }, updates, { new: true }).exec();
  }

  static async delete(id: string): Promise<IProduct | null> {
    return await Product.findOneAndDelete({ id }).exec();
  }
}
