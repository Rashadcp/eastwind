import { Application, IApplication } from "../db.js";
import { sanitizeObjectImages } from "../utils/imageStorage.js";
import { invalidateCache } from "../utils/cache.js";

export class ApplicationModel {
  static async getAll(): Promise<any[]> {
    return await Application.find({}).lean().exec();
  }

  static async getById(id: string): Promise<any | null> {
    return await Application.findOne({ id }).lean().exec();
  }

  static async create(data: Partial<IApplication>): Promise<any> {
    const sanitized = sanitizeObjectImages(data, data.id || "app");
    const doc = await Application.create(sanitized);
    invalidateCache("applications");
    return doc;
  }

  static async update(id: string, updates: Partial<IApplication>): Promise<any | null> {
    const sanitized = sanitizeObjectImages(updates, id);
    const doc = await Application.findOneAndUpdate({ id }, sanitized, { new: true }).lean().exec();
    invalidateCache("applications");
    return doc;
  }

  static async delete(id: string): Promise<any | null> {
    const doc = await Application.findOneAndDelete({ id }).lean().exec();
    invalidateCache("applications");
    return doc;
  }
}
