import { ContactSettings, IContactSettings } from "../db.js";
import { sanitizeObjectImages } from "../utils/imageStorage.js";
import { invalidateCache } from "../utils/cache.js";

export class ContactSettingsModel {
  static async getAll(): Promise<any[]> {
    return await ContactSettings.find({}).lean().exec();
  }

  static async getBySection(id: string): Promise<any | null> {
    return await ContactSettings.findOne({ id }).lean().exec();
  }

  static async upsertSection(id: string, data: Partial<IContactSettings>): Promise<any> {
    const sanitized = sanitizeObjectImages(data, `contact_${id}`);
    const doc = await ContactSettings.findOneAndUpdate(
      { id },
      { ...sanitized, id },
      { new: true, upsert: true }
    ).lean().exec();
    invalidateCache("contact-settings");
    return doc;
  }
}
