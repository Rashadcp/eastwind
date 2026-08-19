import { ContactSettings, IContactSettings } from "../db.js";

export class ContactSettingsModel {
  static async getAll(): Promise<IContactSettings[]> {
    return await ContactSettings.find({}).exec();
  }

  static async getBySection(id: string): Promise<IContactSettings | null> {
    return await ContactSettings.findOne({ id }).exec();
  }

  static async upsertSection(id: string, data: Partial<IContactSettings>): Promise<IContactSettings> {
    return await ContactSettings.findOneAndUpdate(
      { id },
      { ...data, id },
      { new: true, upsert: true }
    ).exec();
  }
}
