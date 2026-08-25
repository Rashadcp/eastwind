import { Solution, ISolution } from "../db.js";
import { sanitizeObjectImages } from "../utils/imageStorage.js";
import { invalidateCache } from "../utils/cache.js";

export class SolutionModel {
  static async getAll(): Promise<any[]> {
    return await Solution.find({}).lean().exec();
  }

  static async getById(id: string): Promise<any | null> {
    return await Solution.findOne({ id }).lean().exec();
  }

  static async create(data: Partial<ISolution>): Promise<any> {
    const sanitized = sanitizeObjectImages(data, data.id || "sol");
    const doc = await Solution.create(sanitized);
    invalidateCache("solution");
    return doc;
  }

  static async update(id: string, updates: Partial<ISolution>): Promise<any | null> {
    const sanitized = sanitizeObjectImages(updates, id);
    const doc = await Solution.findOneAndUpdate({ id }, sanitized, { new: true }).lean().exec();
    invalidateCache("solution");
    return doc;
  }

  static async delete(id: string): Promise<any | null> {
    const doc = await Solution.findOneAndDelete({ id }).lean().exec();
    invalidateCache("solution");
    return doc;
  }
}
