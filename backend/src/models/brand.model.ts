import mongoose from "mongoose";
import { Brand, IBrand } from "../db.js";
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

export class BrandModel {
  static async getAll(): Promise<any[]> {
    return await Brand.find({}).lean().exec();
  }

  static async getById(id: string): Promise<any | null> {
    return await Brand.findOne(buildIdQuery(id)).lean().exec();
  }

  static async create(data: Partial<IBrand>): Promise<any> {
    const sanitized = sanitizeObjectImages(data, data.id || "brand");
    const created = await Brand.create(sanitized);
    invalidateCache("brand");
    return created;
  }

  static async update(id: string, updates: Partial<IBrand>): Promise<any | null> {
    const sanitized = sanitizeObjectImages(updates, id);
    const updated = await Brand.findOneAndUpdate(buildIdQuery(id), sanitized, { new: true }).lean().exec();
    invalidateCache("brand");
    return updated;
  }

  static async delete(id: string): Promise<any | null> {
    const deleted = await Brand.findOneAndDelete(buildIdQuery(id)).lean().exec();
    invalidateCache("brand");
    return deleted;
  }
}
