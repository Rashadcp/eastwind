import mongoose from "mongoose";
import { Solution, ISolution } from "../db.js";
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

export class SolutionModel {
  static async getAll(): Promise<any[]> {
    return await Solution.find({}).lean().exec();
  }

  static async getById(id: string): Promise<any | null> {
    return await Solution.findOne(buildIdQuery(id)).lean().exec();
  }

  static async create(data: Partial<ISolution>): Promise<any> {
    const sanitized = sanitizeObjectImages(data, data.id || "sol");
    const doc = await Solution.create(sanitized);
    invalidateCache("solution");
    return doc;
  }

  static async update(id: string, updates: Partial<ISolution>): Promise<any | null> {
    const sanitized = sanitizeObjectImages(updates, id);
    const doc = await Solution.findOneAndUpdate(buildIdQuery(id), sanitized, { new: true }).lean().exec();
    invalidateCache("solution");
    return doc;
  }

  static async delete(id: string): Promise<any | null> {
    const doc = await Solution.findOneAndDelete(buildIdQuery(id)).lean().exec();
    invalidateCache("solution");
    return doc;
  }
}
