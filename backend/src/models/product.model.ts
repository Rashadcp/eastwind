import { Product, IProduct } from "../db.js";
import { sanitizeObjectImages } from "../utils/imageStorage.js";
import { invalidateCache } from "../utils/cache.js";

export class ProductModel {
  static async getAll(): Promise<any[]> {
    return await Product.find({}).lean().exec();
  }

  static async getById(id: string): Promise<any | null> {
    return await Product.findOne({ id }).lean().exec();
  }

  static async create(data: Partial<IProduct>): Promise<any> {
    const sanitized = sanitizeObjectImages(data, data.id || "prod");
    const doc = await Product.create(sanitized);
    invalidateCache("product");
    return doc;
  }

  static async update(id: string, updates: Partial<IProduct>): Promise<any | null> {
    const sanitized = sanitizeObjectImages(updates, id);
    const doc = await Product.findOneAndUpdate({ id }, sanitized, { new: true }).lean().exec();
    invalidateCache("product");
    return doc;
  }

  static async delete(id: string): Promise<any | null> {
    const doc = await Product.findOneAndDelete({ id }).lean().exec();
    invalidateCache("product");
    return doc;
  }
}
