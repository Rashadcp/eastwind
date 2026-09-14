import { Request, Response, NextFunction } from "express";
import { PrivacyPolicyModel } from "../models/privacyPolicy.model.js";

export class PrivacyPolicyController {
  static async get(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const doc = await PrivacyPolicyModel.get();
      res.json(doc);
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const updated = await PrivacyPolicyModel.update(req.body);
      res.json(updated);
    } catch (error) {
      next(error);
    }
  }
}
