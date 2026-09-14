import mongoose from "mongoose";
import { SuccessStory, ISuccessStory } from "../db.js";
import { sanitizeObjectImages } from "../utils/imageStorage.js";
import { invalidateCache } from "../utils/cache.js";

function buildIdQuery(rawId: string) {
  const decoded = decodeURIComponent(rawId).trim();
  const raw = rawId.trim();
  const orConditions: any[] = [
    { id: raw },
    { id: decoded },
    { id: { $regex: new RegExp(`^${raw}$`, "i") } },
    { id: { $regex: new RegExp(`^${decoded}$`, "i") } }
  ];

  if (mongoose.Types.ObjectId.isValid(raw)) {
    orConditions.push({ _id: new mongoose.Types.ObjectId(raw) });
  }
  if (mongoose.Types.ObjectId.isValid(decoded)) {
    orConditions.push({ _id: new mongoose.Types.ObjectId(decoded) });
  }

  return { $or: orConditions };
}

export class SuccessStoryModel {
  static async getAll(): Promise<any[]> {
    return await SuccessStory.find({}).sort({ createdAt: -1 }).lean().exec();
  }

  static async getById(id: string): Promise<any | null> {
    return await SuccessStory.findOne(buildIdQuery(id)).lean().exec();
  }

  static async create(data: Partial<ISuccessStory>): Promise<any> {
    if (!data.id) {
      data.id = `story-${Date.now()}`;
    }
    if (!data.summary) {
      data.summary = (data as any).description || "";
    }
    const sanitized = sanitizeObjectImages(data, data.id);
    const doc = await SuccessStory.create(sanitized);
    invalidateCache("success-stories");
    return doc;
  }

  static async update(id: string, updates: Partial<ISuccessStory>): Promise<any | null> {
    const sanitized = sanitizeObjectImages(updates, id);
    const doc = await SuccessStory.findOneAndUpdate(buildIdQuery(id), sanitized, { new: true }).lean().exec();
    invalidateCache("success-stories");
    return doc;
  }

  static async delete(id: string): Promise<any | null> {
    const doc = await SuccessStory.findOneAndDelete(buildIdQuery(id)).lean().exec();
    invalidateCache("success-stories");
    return doc;
  }
}
