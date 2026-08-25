import { Brand, IBrand } from "../db.js";
import { sanitizeObjectImages } from "../utils/imageStorage.js";
import { invalidateCache } from "../utils/cache.js";

export class BrandModel {
  static async getAll(): Promise<any[]> {
    return await Brand.find({}).lean().exec();
  }

  static async getById(id: string): Promise<any | null> {
    return await Brand.findOne({ id }).lean().exec();
  }

  static async create(data: Partial<IBrand>): Promise<any> {
    const sanitized = sanitizeObjectImages(data, data.id || "brand");
    const created = await Brand.create(sanitized);
    invalidateCache("brand");
    return created;
  }

  static async update(id: string, updates: Partial<IBrand>): Promise<any | null> {
    const sanitized = sanitizeObjectImages(updates, id);
    const updated = await Brand.findOneAndUpdate({ id }, sanitized, { new: true }).lean().exec();
    invalidateCache("brand");
    return updated;
  }

  static async delete(id: string): Promise<any | null> {
    const deleted = await Brand.findOneAndDelete({ id }).lean().exec();
    invalidateCache("brand");
    return deleted;
  }
}
