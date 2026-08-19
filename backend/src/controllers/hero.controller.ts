import { Request, Response, NextFunction } from "express";
import HeroModel from "../models/hero.model.js";

export class HeroController {
  static async getHero(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      let hero = await HeroModel.findOne({ id: "hero_settings" });
      if (!hero) {
        hero = await HeroModel.create({ id: "hero_settings" });
      }
      res.json(hero);
    } catch (error) {
      next(error);
    }
  }

  static async updateHero(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const payload = req.body;
      const hero = await HeroModel.findOneAndUpdate(
        { id: "hero_settings" },
        { ...payload, id: "hero_settings" },
        { new: true, upsert: true }
      );
      res.json(hero);
    } catch (error) {
      next(error);
    }
  }
}
