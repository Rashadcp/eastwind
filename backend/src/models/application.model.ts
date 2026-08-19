import { Application, IApplication } from "../db.js";

export class ApplicationModel {
  static async getAll(): Promise<IApplication[]> {
    return await Application.find({}).exec();
  }

  static async getById(id: string): Promise<IApplication | null> {
    return await Application.findOne({ id }).exec();
  }

  static async create(data: Partial<IApplication>): Promise<IApplication> {
    return await Application.create(data);
  }

  static async update(id: string, updates: Partial<IApplication>): Promise<IApplication | null> {
    return await Application.findOneAndUpdate({ id }, updates, { new: true }).exec();
  }

  static async delete(id: string): Promise<IApplication | null> {
    return await Application.findOneAndDelete({ id }).exec();
  }
}
