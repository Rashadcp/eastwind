import { Service, IService } from "../db.js";
import { sanitizeObjectImages } from "../utils/imageStorage.js";
import { invalidateCache } from "../utils/cache.js";

export class ServiceModel {
  static async getAll(): Promise<any[]> {
    return await Service.find({}).lean().exec();
  }

  static async getById(id: string): Promise<any | null> {
    return await Service.findOne({ id }).lean().exec();
  }

  static async create(data: Partial<IService>): Promise<any> {
    const sanitized = sanitizeObjectImages(data, data.id || "svc");
    const doc = await Service.create(sanitized);
    invalidateCache("services");
    return doc;
  }

  static async update(id: string, updates: Partial<IService>): Promise<any | null> {
    const sanitized = sanitizeObjectImages(updates, id);
    const doc = await Service.findOneAndUpdate({ id }, sanitized, { new: true }).lean().exec();
    invalidateCache("services");
    return doc;
  }

  static async delete(id: string): Promise<any | null> {
    const doc = await Service.findOneAndDelete({ id }).lean().exec();
    invalidateCache("services");
    return doc;
  }
}
