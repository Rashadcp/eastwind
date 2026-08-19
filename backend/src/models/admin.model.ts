import { Admin, IAdmin } from "../db.js";

export class AdminModel {
  static async getByUsername(username: string): Promise<IAdmin | null> {
    return await Admin.findOne({ username }).exec();
  }

  static async updatePassword(username: string, passwordHash: string, salt: string): Promise<IAdmin | null> {
    return await Admin.findOneAndUpdate(
      { username },
      { passwordHash, salt },
      { new: true }
    ).exec();
  }
}
