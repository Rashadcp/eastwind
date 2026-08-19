import { Service, IService } from "../db.js";

export class ServiceModel {
  static async getAll(): Promise<IService[]> {
    return await Service.find({}).exec();
  }

  static async getById(id: string): Promise<IService | null> {
    return await Service.findOne({ id }).exec();
  }

  static async create(data: Partial<IService>): Promise<IService> {
    return await Service.create(data);
  }

  static async update(id: string, updates: Partial<IService>): Promise<IService | null> {
    return await Service.findOneAndUpdate({ id }, updates, { new: true }).exec();
  }

  static async delete(id: string): Promise<IService | null> {
    return await Service.findOneAndDelete({ id }).exec();
  }
}
