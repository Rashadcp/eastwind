import fs from "fs";
import { DB_FILE } from "../config.js";
import { ProductPage } from "../db.js";
import { invalidateCache } from "../utils/cache.js";

const DEFAULT_TITLE = "Industrial Safety & Hazardous Systems";

export class ProductPageModel {
  static async get(): Promise<{ id: string; title: string }> {
    let doc = await ProductPage.findOne({ id: "products_page" }).lean().exec();
    if (!doc) {
      let initialTitle = DEFAULT_TITLE;
      if (fs.existsSync(DB_FILE)) {
        try {
          const raw = fs.readFileSync(DB_FILE, "utf-8");
          const dbData = JSON.parse(raw);
          if (dbData.products_page) {
            const fromDb = Array.isArray(dbData.products_page) ? dbData.products_page[0] : dbData.products_page;
            if (fromDb && fromDb.title) {
              initialTitle = fromDb.title;
            }
          }
        } catch (e) {
          console.error("Failed to read products_page from database.json:", e);
        }
      }

      doc = await ProductPage.findOneAndUpdate(
        { id: "products_page" },
        { id: "products_page", title: initialTitle },
        { new: true, upsert: true }
      ).lean().exec();
    }
    return (doc as any) || { id: "products_page", title: DEFAULT_TITLE };
  }

  static async update(title: string): Promise<{ id: string; title: string }> {
    const cleanTitle = (title && typeof title === "string" && title.trim()) ? title.trim() : DEFAULT_TITLE;
    const doc = await ProductPage.findOneAndUpdate(
      { id: "products_page" },
      { id: "products_page", title: cleanTitle },
      { new: true, upsert: true }
    ).lean().exec();

    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, "utf-8");
        const dbData = JSON.parse(raw);
        dbData.products_page = [{ id: "products_page", title: cleanTitle }];
        fs.writeFileSync(DB_FILE, JSON.stringify(dbData, null, 2), "utf-8");
      }
    } catch (e) {
      console.error("Failed to sync products_page to database.json:", e);
    }

    invalidateCache("products-page");
    invalidateCache("product");
    return (doc as any) || { id: "products_page", title: cleanTitle };
  }
}
