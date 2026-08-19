import { Solution, ISolution } from "../db.js";

export class SolutionModel {
  static async getAll(): Promise<ISolution[]> {
    return await Solution.find({}).exec();
  }

  static async getById(id: string): Promise<ISolution | null> {
    return await Solution.findOne({ id }).exec();
  }

  static async create(data: Partial<ISolution>): Promise<ISolution> {
    return await Solution.create(data);
  }

  static async update(id: string, updates: Partial<ISolution>): Promise<ISolution | null> {
    return await Solution.findOneAndUpdate({ id }, updates, { new: true }).exec();
  }

  static async delete(id: string): Promise<ISolution | null> {
    return await Solution.findOneAndDelete({ id }).exec();
  }
}
