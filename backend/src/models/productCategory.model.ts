import mongoose, { Schema, Document } from "mongoose";
import fs from "fs";
import { DB_FILE } from "../config.js";
import { invalidateCache } from "../utils/cache.js";
import { Product } from "../db.js";

export interface IProductCategory extends Document {
  id: string;
  name: string;
  order: number;
}

const ProductCategorySchema = new Schema<IProductCategory>(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    order: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export const ProductCategory =
  mongoose.models.ProductCategory ||
  mongoose.model<IProductCategory>("ProductCategory", ProductCategorySchema);

export const DEFAULT_PRODUCT_CATEGORIES = [
  { id: "linear-heat-detection", name: "Linear Heat Detection", order: 0 },
  { id: "air-compressors", name: "Air Compressors", order: 1 },
  { id: "damage-control-systems", name: "Damage Control Systems", order: 2 },
  { id: "firefighting-suits-gear", name: "Firefighting Suits & Gear", order: 3 },
  { id: "compressed-air-foam-cafs", name: "Compressed Air Foam (CAFS)", order: 4 },
  { id: "wireless-gas-detection-telemetry", name: "Wireless Gas Detection & Telemetry", order: 5 },
  { id: "intrinsically-safe-mobile-devices", name: "Intrinsically Safe Mobile Devices", order: 6 },
  { id: "explosion-proof-lighting", name: "Explosion-Proof Lighting", order: 7 },
  { id: "breathing-air-lines-hoses", name: "Breathing Air Lines & Hoses", order: 8 },
  { id: "quick-connect-couplings", name: "Quick Connect Couplings", order: 9 },
  { id: "emergency-flange-adapters", name: "Emergency Flange Adapters", order: 10 }
];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function syncToDatabaseJson(categories: any[]): void {
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, "utf-8");
      const data = JSON.parse(raw);
      data.product_categories = categories;
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
    }
  } catch (err) {
    console.error("Failed to sync categories to database.json:", err);
  }
}

export class ProductCategoryModel {
  /**
   * Fetch all categories sorted by order ascending.
   * Auto-seeds defaults if none exist in MongoDB or database.json.
   */
  static async getAll(): Promise<any[]> {
    let list = await ProductCategory.find({}).sort({ order: 1, createdAt: 1 }).lean().exec();

    // If MongoDB is completely empty or only contains the initial single test entry 'cat-test-1':
    const isOnlyTempTest = list && list.length === 1 && list[0].id === "cat-test-1";
    if (!list || list.length === 0 || isOnlyTempTest) {
      if (fs.existsSync(DB_FILE)) {
        try {
          const raw = fs.readFileSync(DB_FILE, "utf-8");
          const data = JSON.parse(raw);
          if (Array.isArray(data.product_categories) && data.product_categories.length > 1) {
            if (isOnlyTempTest) {
              await ProductCategory.deleteMany({});
            }
            await ProductCategory.insertMany(data.product_categories);
            return data.product_categories.sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
          }
        } catch (e) {}
      }

      if (!list || list.length === 0) {
        await ProductCategory.insertMany(DEFAULT_PRODUCT_CATEGORIES);
        syncToDatabaseJson(DEFAULT_PRODUCT_CATEGORIES);
        return DEFAULT_PRODUCT_CATEGORIES as any[];
      }
    }

    return list;
  }

  /**
   * Save the entire reordered list of categories.
   */
  static async saveOrder(categories: { id?: string; name: string; order?: number }[]): Promise<any[]> {
    if (!Array.isArray(categories)) {
      throw new Error("Categories must be an array");
    }

    const cleaned = categories.map((cat, idx) => ({
      id: cat.id || slugify(cat.name),
      name: cat.name.trim(),
      order: idx
    }));

    // Replace all records in MongoDB
    await ProductCategory.deleteMany({});
    const inserted = await ProductCategory.insertMany(cleaned);
    syncToDatabaseJson(cleaned);

    invalidateCache("product-categories");
    invalidateCache("product");
    return inserted;
  }

  /**
   * Add a new category to the end of the list.
   */
  static async create(name: string): Promise<any> {
    const trimmed = name.trim();
    if (!trimmed) throw new Error("Category name is required");

    const id = slugify(trimmed);
    const existing = await ProductCategory.findOne({ $or: [{ id }, { name: { $regex: new RegExp(`^${trimmed}$`, "i") } }] }).lean().exec();
    if (existing) {
      throw new Error(`Category '${trimmed}' already exists`);
    }

    const count = await ProductCategory.countDocuments();
    const newCat = await ProductCategory.create({
      id,
      name: trimmed,
      order: count
    });

    const all = await this.getAll();
    syncToDatabaseJson(all);

    invalidateCache("product-categories");
    invalidateCache("product");
    return newCat;
  }

  /**
   * Rename an existing category and automatically update all products assigned to it.
   */
  static async update(idOrName: string, newName: string): Promise<any> {
    const trimmedNew = newName.trim();
    if (!trimmedNew) throw new Error("New category name is required");

    const category = await ProductCategory.findOne({
      $or: [{ id: idOrName }, { name: idOrName }]
    }).exec();

    if (!category) {
      throw new Error("Category not found to update");
    }

    const oldName = category.name;
    category.name = trimmedNew;
    category.id = slugify(trimmedNew);
    await category.save();

    // Update all matching products in the Product collection!
    await Product.updateMany(
      { brand: { $regex: new RegExp(`^${oldName}$`, "i") } },
      { $set: { brand: trimmedNew } }
    );

    const all = await this.getAll();
    syncToDatabaseJson(all);

    invalidateCache("product-categories");
    invalidateCache("product");
    return category;
  }

  /**
   * Delete a category from the list.
   */
  static async delete(idOrName: string): Promise<any> {
    const deleted = await ProductCategory.findOneAndDelete({
      $or: [{ id: idOrName }, { name: idOrName }]
    }).lean().exec();

    if (!deleted) {
      throw new Error("Category not found to delete");
    }

    // Re-index remaining categories
    const remaining = await ProductCategory.find({}).sort({ order: 1 }).exec();
    for (let i = 0; i < remaining.length; i++) {
      remaining[i].order = i;
      await remaining[i].save();
    }

    const all = await ProductCategory.find({}).sort({ order: 1 }).lean().exec();
    syncToDatabaseJson(all);

    invalidateCache("product-categories");
    invalidateCache("product");
    return deleted;
  }
}
