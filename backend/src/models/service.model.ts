import mongoose from "mongoose";
import { Service, IService } from "../db.js";
import { sanitizeObjectImages } from "../utils/imageStorage.js";
import { invalidateCache } from "../utils/cache.js";

function buildIdQuery(id: string): any {
  const raw = id ? String(id).trim() : "";
  let decoded = raw;
  try {
    decoded = decodeURIComponent(raw);
  } catch (e) {
    decoded = raw;
  }

  const orConditions: any[] = [
    { id: raw },
    { id: decoded },
    { id: new RegExp(`^${raw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, "i") }
  ];

  if (mongoose.Types.ObjectId.isValid(raw)) {
    orConditions.push({ _id: new mongoose.Types.ObjectId(raw) });
  }
  if (decoded !== raw && mongoose.Types.ObjectId.isValid(decoded)) {
    orConditions.push({ _id: new mongoose.Types.ObjectId(decoded) });
  }

  return { $or: orConditions };
}

export class ServiceModel {
  static async getAll(): Promise<any[]> {
    return await Service.find({}).lean().exec();
  }

  static async getById(id: string): Promise<any | null> {
    const query = buildIdQuery(id);
    return await Service.findOne(query).lean().exec();
  }

  static async create(data: Partial<IService>): Promise<any> {
    const sanitized = sanitizeObjectImages(data, data.id || "svc");
    const doc = await Service.create(sanitized);
    invalidateCache("services");
    return doc;
  }

  static async update(id: string, updates: Partial<IService>): Promise<any | null> {
    const sanitized = sanitizeObjectImages(updates, id);
    const query = buildIdQuery(id);
    const doc = await Service.findOneAndUpdate(query, sanitized, { new: true }).lean().exec();
    invalidateCache("services");
    return doc;
  }

  static async delete(id: string): Promise<any | null> {
    const query = buildIdQuery(id);
    const doc = await Service.findOneAndDelete(query).lean().exec();
    invalidateCache("services");
    return doc;
  }
}

