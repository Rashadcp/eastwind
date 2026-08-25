import { SuccessStory, ISuccessStory } from "../db.js";
import { sanitizeObjectImages } from "../utils/imageStorage.js";
import { invalidateCache } from "../utils/cache.js";

export class SuccessStoryModel {
  static async getAll(): Promise<any[]> {
    return await SuccessStory.find({}).sort({ createdAt: -1 }).lean().exec();
  }

  static async getById(id: string): Promise<any | null> {
    return await SuccessStory.findOne({ id }).lean().exec();
  }

  static async create(data: Partial<ISuccessStory>): Promise<any> {
    if (!data.id) {
      data.id = `story-${Date.now()}`;
    }
    const sanitized = sanitizeObjectImages(data, data.id);
    const doc = await SuccessStory.create(sanitized);
    invalidateCache("success-stories");
    return doc;
  }

  static async update(id: string, updates: Partial<ISuccessStory>): Promise<any | null> {
    const sanitized = sanitizeObjectImages(updates, id);
    const doc = await SuccessStory.findOneAndUpdate({ id }, sanitized, { new: true }).lean().exec();
    invalidateCache("success-stories");
    return doc;
  }

  static async delete(id: string): Promise<any | null> {
    const doc = await SuccessStory.findOneAndDelete({ id }).lean().exec();
    invalidateCache("success-stories");
    return doc;
  }
}
