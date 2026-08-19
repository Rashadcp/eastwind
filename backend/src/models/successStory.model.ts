import { SuccessStory, ISuccessStory } from "../db.js";
import { DB_FILE } from "../config.js";
import fs from "fs";

export class SuccessStoryModel {
  static async getAll(): Promise<ISuccessStory[]> {
    let items = await SuccessStory.find({}).sort({ createdAt: -1 }).exec();

    // Auto-sync from database.json if empty
    if (!items || items.length === 0) {
      if (fs.existsSync(DB_FILE)) {
        try {
          const rawData = fs.readFileSync(DB_FILE, "utf-8");
          const seed = JSON.parse(rawData);
          if (seed.success_stories && seed.success_stories.length > 0) {
            for (const item of seed.success_stories) {
              await SuccessStory.findOneAndUpdate({ id: item.id }, item, { upsert: true, new: true });
            }
            items = await SuccessStory.find({}).sort({ createdAt: -1 }).exec();
          }
        } catch (e) {
          console.error("Auto-syncing success stories failed:", e);
        }
      }
    }

    return items;
  }

  static async getById(id: string): Promise<ISuccessStory | null> {
    return await SuccessStory.findOne({ id }).exec();
  }

  static async create(data: Partial<ISuccessStory>): Promise<ISuccessStory> {
    if (!data.id) {
      data.id = `story-${Date.now()}`;
    }
    return await SuccessStory.create(data);
  }

  static async update(id: string, updates: Partial<ISuccessStory>): Promise<ISuccessStory | null> {
    return await SuccessStory.findOneAndUpdate({ id }, updates, { new: true }).exec();
  }

  static async delete(id: string): Promise<ISuccessStory | null> {
    return await SuccessStory.findOneAndDelete({ id }).exec();
  }
}
