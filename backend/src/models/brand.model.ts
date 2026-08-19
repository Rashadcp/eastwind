import { Brand, IBrand } from "../db.js";
import { DB_FILE } from "../config.js";
import fs from "fs";

export class BrandModel {
  static async getAll(): Promise<IBrand[]> {
    let items = await Brand.find({}).exec();

    // Initial seed from database.json ONLY if MongoDB collection is completely empty
    if (!items || items.length === 0) {
      if (fs.existsSync(DB_FILE)) {
        try {
          const rawData = fs.readFileSync(DB_FILE, "utf-8");
          const seed = JSON.parse(rawData);
          if (seed.brands && seed.brands.length > 0) {
            await Brand.insertMany(seed.brands);
            items = await Brand.find({}).exec();
          }
        } catch (e) {
          console.error("Seeding brands failed:", e);
        }
      }
    }

    return items;
  }

  static async getById(id: string): Promise<IBrand | null> {
    return await Brand.findOne({ id }).exec();
  }

  static async create(data: Partial<IBrand>): Promise<IBrand> {
    const created = await Brand.create(data);
    await this.syncDatabaseFile();
    return created;
  }

  static async update(id: string, updates: Partial<IBrand>): Promise<IBrand | null> {
    const updated = await Brand.findOneAndUpdate({ id }, updates, { new: true }).exec();
    await this.syncDatabaseFile();
    return updated;
  }

  static async delete(id: string): Promise<IBrand | null> {
    const deleted = await Brand.findOneAndDelete({ id }).exec();
    await this.syncDatabaseFile();
    return deleted;
  }

  private static async syncDatabaseFile() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const items = await Brand.find({}).exec();
        const rawData = fs.readFileSync(DB_FILE, "utf-8");
        const seed = JSON.parse(rawData);
        seed.brands = items;
        fs.writeFileSync(DB_FILE, JSON.stringify(seed, null, 2), "utf-8");
      }
    } catch (e) {
      console.error("Syncing database.json brands failed:", e);
    }
  }
}
