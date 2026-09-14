import mongoose from "mongoose";
import { Application, IApplication } from "../db.js";
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

export class ApplicationModel {
  static async getAll(): Promise<any[]> {
    return await Application.find({}).lean().exec();
  }

  static async getById(id: string): Promise<any | null> {
    const query = buildIdQuery(id);
    return await Application.findOne(query).lean().exec();
  }

  static async create(data: Partial<IApplication>): Promise<any> {
    const sanitized = sanitizeObjectImages(data, data.id || "app");
    const doc = await Application.create(sanitized);
    invalidateCache("applications");
    return doc;
  }

  static async update(id: string, updates: Partial<IApplication>): Promise<any | null> {
    const sanitized = sanitizeObjectImages(updates, id);
    const query = buildIdQuery(id);
    const doc = await Application.findOneAndUpdate(query, sanitized, { new: true }).lean().exec();
    invalidateCache("applications");
    return doc;
  }

  static async delete(id: string): Promise<any | null> {
    const query = buildIdQuery(id);
    const doc = await Application.findOneAndDelete(query).lean().exec();
    invalidateCache("applications");
    return doc;
  }
}

