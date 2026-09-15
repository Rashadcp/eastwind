import fs from "fs";
import mongoose from "mongoose";
import { DB_FILE } from "../config.js";
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
    const list = await Solution.find({ id: { $ne: "reorder" } }).lean().exec();
    return list.sort((a: any, b: any) => {
      const orderA = typeof a.order === "number" ? a.order : 99999;
      const orderB = typeof b.order === "number" ? b.order : 99999;
      if (orderA !== orderB) return orderA - orderB;
      return (a.createdAt ? new Date(a.createdAt).getTime() : 0) - (b.createdAt ? new Date(b.createdAt).getTime() : 0);
    });
  }

  static async getById(id: string): Promise<any | null> {
    return await Solution.findOne(buildIdQuery(id)).lean().exec();
  }

  static async create(data: Partial<ISolution>): Promise<any> {
    if (data.order === undefined) {
      const count = await Solution.countDocuments();
      data.order = count;
    }
    const sanitized = sanitizeObjectImages(data, data.id || "sol");
    const doc = await Solution.create(sanitized);

    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, "utf-8");
        const dbData = JSON.parse(raw);
        if (Array.isArray(dbData.solutions)) {
          const plain = doc.toObject ? doc.toObject() : doc;
          dbData.solutions.push(plain);
          fs.writeFileSync(DB_FILE, JSON.stringify(dbData, null, 2), "utf-8");
        }
      }
    } catch (e) {
      console.error("Failed to sync new solution to database.json:", e);
    }

    invalidateCache("solution");
    return doc;
  }

  static async reorder(items: { id: string; order: number }[]): Promise<boolean> {
    if (!Array.isArray(items) || items.length === 0) {
      throw new Error("Items must be a non-empty array of { id, order }");
    }

    const cleanItems = items.filter((it) => it.id && it.id !== "reorder");

    const bulkOps = cleanItems.map((item, idx) => ({
      updateOne: {
        filter: { id: item.id },
        update: { $set: { order: typeof item.order === "number" ? item.order : idx } }
      }
    }));

    if (bulkOps.length > 0) {
      await Solution.bulkWrite(bulkOps);
    }

    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, "utf-8");
        const dbData = JSON.parse(raw);
        if (Array.isArray(dbData.solutions)) {
          const orderMap = new Map(cleanItems.map((it, idx) => [it.id, typeof it.order === "number" ? it.order : idx]));
          dbData.solutions.forEach((s: any) => {
            if (orderMap.has(s.id)) {
              s.order = orderMap.get(s.id);
            }
          });
          dbData.solutions = dbData.solutions.filter((s: any) => s.id !== "reorder");
          dbData.solutions.sort((a: any, b: any) => (a.order ?? 99999) - (b.order ?? 99999));
          fs.writeFileSync(DB_FILE, JSON.stringify(dbData, null, 2), "utf-8");
        }
      }
    } catch (e) {
      console.error("Failed to sync reordered solutions to database.json:", e);
    }

    invalidateCache("solution");
    return true;
  }

  static async update(id: string, updates: Partial<ISolution>): Promise<any | null> {
    const sanitized = sanitizeObjectImages(updates, id);
    const doc = await Solution.findOneAndUpdate(buildIdQuery(id), sanitized, { new: true }).lean().exec();
    
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, "utf-8");
        const dbData = JSON.parse(raw);
        if (Array.isArray(dbData.solutions)) {
          const idx = dbData.solutions.findIndex((s: any) => s.id === id || s._id === id);
          if (idx !== -1) {
            dbData.solutions[idx] = { ...dbData.solutions[idx], ...sanitized };
            fs.writeFileSync(DB_FILE, JSON.stringify(dbData, null, 2), "utf-8");
          }
        }
      }
    } catch (e) {
      console.error("Failed to sync updated solution to database.json:", e);
    }

    invalidateCache("solution");
    return doc;
  }

  static async delete(id: string): Promise<any | null> {
    const doc = await Solution.findOneAndDelete(buildIdQuery(id)).lean().exec();

    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, "utf-8");
        const dbData = JSON.parse(raw);
        if (Array.isArray(dbData.solutions)) {
          dbData.solutions = dbData.solutions.filter((s: any) => s.id !== id && s._id !== id);
          fs.writeFileSync(DB_FILE, JSON.stringify(dbData, null, 2), "utf-8");
        }
      }
    } catch (e) {
      console.error("Failed to sync deleted solution from database.json:", e);
    }

    invalidateCache("solution");
    return doc;
  }
}
