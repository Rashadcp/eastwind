import fs from "fs";
import mongoose from "mongoose";
import { DB_FILE } from "../config.js";
import { Product, Brand, IProduct } from "../db.js";
import { sanitizeObjectImages } from "../utils/imageStorage.js";
import { invalidateCache } from "../utils/cache.js";

function buildIdQuery(rawId: string) {
  const decoded = decodeURIComponent(rawId).trim();
  const raw = rawId.trim();
  const orConditions: any[] = [
    { id: raw },
    { id: decoded },
    { slug: raw },
    { slug: decoded },
    { id: { $regex: new RegExp(`^${raw}$`, "i") } },
    { id: { $regex: new RegExp(`^${decoded}$`, "i") } }
  ];

  if (mongoose.Types.ObjectId.isValid(raw)) {
    orConditions.push({ _id: new mongoose.Types.ObjectId(raw) });
  }
  if (mongoose.Types.ObjectId.isValid(decoded)) {
    orConditions.push({ _id: new mongoose.Types.ObjectId(decoded) });
  }

  return { $or: orConditions };
}

const BRAND_TO_CATEGORY: Record<string, string> = {
  "one seven": "Compressed Air Foam (CAFS)",
  "one-seven": "Compressed Air Foam (CAFS)",
  "sione": "Firefighting Suits & Gear",
  "paratech": "Damage Control Systems",
  "partech": "Damage Control Systems",
  "nardi": "Air Compressors",
  "nardi compressor": "Air Compressors",
  "poly hose": "Breathing Air Lines & Hoses",
  "polyhose": "Breathing Air Lines & Hoses",
  "cejn": "Quick Connect Couplings",
  "key connections": "Emergency Flange Adapters",
  "mimes": "Wireless Gas Detection & Telemetry",
  "xshielder": "Intrinsically Safe Mobile Devices",
  "atexor": "Explosion-Proof Lighting",
  "thermo cable": "Linear Heat Detection",
  "thermo-cable": "Linear Heat Detection",
  "thermocable": "Linear Heat Detection"
};

function sanitizeBrand(brand?: string): string {
  if (!brand) return "Industrial Safety Equipment";
  const key = brand.trim().toLowerCase();
  return BRAND_TO_CATEGORY[key] || brand.trim();
}

function cleanProductName(name?: string): string {
  if (!name) return "";
  return name.replace(/^(One Seven|SIONE|Paratech|Partech|Nardi|Xshielder|Mimes|Atexor|Polyhose|Poly Hose|CEJN|Key Connections|Thermo Cable|OS)\s+/i, "").trim();
}

export class ProductModel {
  static async getAll(): Promise<any[]> {
    const list = await Product.find({ id: { $ne: "reorder" } }).lean().exec();
    return list.sort((a: any, b: any) => {
      const orderA = typeof a.order === "number" ? a.order : 99999;
      const orderB = typeof b.order === "number" ? b.order : 99999;
      if (orderA !== orderB) return orderA - orderB;
      return (a.createdAt ? new Date(a.createdAt).getTime() : 0) - (b.createdAt ? new Date(b.createdAt).getTime() : 0);
    });
  }

  static async reorder(items: { id: string; order: number }[]): Promise<boolean> {
    if (!Array.isArray(items) || items.length === 0) {
      throw new Error("Items must be a non-empty array of { id, order }");
    }

    const cleanItems = items.filter((it) => it.id && it.id !== "reorder");

    const bulkOps = cleanItems.map((item, idx) => ({
      updateOne: {
        filter: { id: item.id },
        update: { $set: { order: typeof item.order === "number" ? item.order : idx } }
      }
    }));

    if (bulkOps.length > 0) {
      await Product.bulkWrite(bulkOps);
    }

    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, "utf-8");
        const dbData = JSON.parse(raw);
        if (Array.isArray(dbData.products)) {
          const orderMap = new Map(cleanItems.map((it, idx) => [it.id, typeof it.order === "number" ? it.order : idx]));
          dbData.products.forEach((p: any) => {
            if (orderMap.has(p.id)) {
              p.order = orderMap.get(p.id);
            }
          });
          dbData.products = dbData.products.filter((p: any) => p.id !== "reorder");
          dbData.products.sort((a: any, b: any) => (a.order ?? 99999) - (b.order ?? 99999));
          fs.writeFileSync(DB_FILE, JSON.stringify(dbData, null, 2), "utf-8");
        }
      }
    } catch (e) {
      console.error("Failed to sync reordered products to database.json:", e);
    }

    invalidateCache("product");
    invalidateCache("brand");
    return true;
  }

  static async getById(id: string): Promise<any | null> {
    const query = buildIdQuery(id);
    let item: any = await Product.findOne(query).lean().exec();
    if (!item) {
      const decoded = decodeURIComponent(id).trim();
      const brandWithProd: any = await Brand.findOne({
        $or: [
          { "products.id": id },
          { "products.id": decoded },
          { "products.id": { $regex: new RegExp(`^${id}$`, "i") } }
        ]
      }).lean().exec();
      if (brandWithProd) {
        const bp = brandWithProd.products?.find((p: any) => 
          p.id === id || p.id === decoded || (p.id && p.id.toLowerCase() === id.toLowerCase())
        );
        if (bp) {
          item = {
            id: bp.id,
            slug: `${bp.id}-system`,
            name: cleanProductName(bp.name),
            brand: sanitizeBrand(brandWithProd.name),
            category: bp.category || "Safety Equipment",
            description: bp.description || "",
            features: [],
            specifications: [],
            certifications: [],
            imageUrl: bp.imageUrl || ""
          };
        }
      }
    }
    return item;
  }

  static async create(data: Partial<IProduct>): Promise<any> {
    if (data.brand) data.brand = sanitizeBrand(data.brand);
    if (data.name) data.name = cleanProductName(data.name);
    if (Array.isArray(data.specifications)) {
      data.specifications = data.specifications
        .filter((s: any) => !s.label?.toLowerCase().includes("manufacturer brand"))
        .map((s: any) => {
          if (s.label?.toLowerCase().includes("brand")) {
            return { ...s, label: "Equipment Category", value: data.brand };
          }
          return s;
        });
    }

    const sanitized = sanitizeObjectImages(data, data.id || "prod");
    const doc: any = await Product.create(sanitized);

    // Sync into target brand's products portfolio if brand specified
    if (doc.brand) {
      const targetBrand: any = await Brand.findOne({
        $or: [
          { name: { $regex: new RegExp(`^${doc.brand.trim()}$`, "i") } },
          { id: doc.brand.trim().toLowerCase().replace(/\s+/g, "-") }
        ]
      });
      if (targetBrand) {
        await Brand.updateOne(
          { _id: targetBrand._id },
          {
            $push: {
              products: {
                id: doc.id,
                name: doc.name,
                category: doc.category,
                solutionName: targetBrand.solutionName || doc.category,
                imageUrl: doc.imageUrl || "",
                description: doc.description || ""
              }
            }
          }
        );
        invalidateCache("brand");
      }
    }

    invalidateCache("product");
    return doc;
  }

  static async update(id: string, updates: Partial<IProduct>): Promise<any | null> {
    if (updates.brand) updates.brand = sanitizeBrand(updates.brand);
    if (updates.name) updates.name = cleanProductName(updates.name);
    if (Array.isArray(updates.specifications)) {
      updates.specifications = updates.specifications
        .filter((s: any) => !s.label?.toLowerCase().includes("manufacturer brand"))
        .map((s: any) => {
          if (s.label?.toLowerCase().includes("brand")) {
            return { ...s, label: "Equipment Category", value: updates.brand };
          }
          return s;
        });
    }

    const sanitized = sanitizeObjectImages(updates, id);
    const query = buildIdQuery(id);

    let doc: any = await Product.findOneAndUpdate(query, sanitized, { new: true }).lean().exec();

    // If product was not yet in Product collection (e.g. from seed brand catalog), find & upsert
    if (!doc) {
      const decoded = decodeURIComponent(id).trim();
      const brandWithProd: any = await Brand.findOne({
        $or: [
          { "products.id": id },
          { "products.id": decoded },
          { "products.id": { $regex: new RegExp(`^${id}$`, "i") } }
        ]
      }).lean().exec();
      const bp = brandWithProd?.products?.find((p: any) =>
        p.id === id || p.id === decoded || (p.id && p.id.toLowerCase() === id.toLowerCase())
      );

      const newProductData = {
        id: bp?.id || id,
        slug: `${bp?.id || id}-system`,
        name: updates.name || cleanProductName(bp?.name) || id,
        brand: updates.brand || sanitizeBrand(brandWithProd?.name) || "Industrial Safety Equipment",
        category: updates.category || bp?.category || "Industrial Safety & Fire Protection",
        description: updates.description || bp?.description || "",
        imageUrl: updates.imageUrl || bp?.imageUrl || "",
        features: updates.features || [],
        specifications: updates.specifications || [],
        certifications: updates.certifications || [],
        ...sanitized
      };

      doc = await Product.findOneAndUpdate(query, newProductData, { new: true, upsert: true }).lean().exec();
    }

    if (!doc) {
      return null;
    }

    // Sync changes to Brand collection
    const finalBrandName = updates.brand || doc.brand;
    const targetProdId = doc.id || id;
    if (finalBrandName) {
      const targetBrand: any = await Brand.findOne({
        $or: [
          { name: { $regex: new RegExp(`^${finalBrandName.trim()}$`, "i") } },
          { id: finalBrandName.trim().toLowerCase().replace(/\s+/g, "-") }
        ]
      });

      if (targetBrand) {
        // Remove from all other brands if brand changed
        await Brand.updateMany(
          { _id: { $ne: targetBrand._id }, "products.id": targetProdId },
          { $pull: { products: { id: targetProdId } } }
        );

        // Update or insert into the target brand's products list
        const existingInTarget = targetBrand.products?.some((p: any) => p.id === targetProdId);
        if (existingInTarget) {
          await Brand.updateOne(
            { _id: targetBrand._id, "products.id": targetProdId },
            {
              $set: {
                "products.$.name": doc.name,
                "products.$.category": doc.category,
                "products.$.imageUrl": doc.imageUrl || "",
                "products.$.description": doc.description || ""
              }
            }
          );
        } else {
          await Brand.updateOne(
            { _id: targetBrand._id },
            {
              $push: {
                products: {
                  id: doc.id,
                  name: doc.name,
                  category: doc.category,
                  solutionName: targetBrand.solutionName || doc.category,
                  imageUrl: doc.imageUrl || "",
                  description: doc.description || ""
                }
              }
            }
          );
        }
      }
    } else {
      // If brand didn't change, update the product info in whatever brand currently has it
      await Brand.updateMany(
        { "products.id": targetProdId },
        {
          $set: {
            "products.$.name": doc.name,
            "products.$.category": doc.category,
            "products.$.imageUrl": doc.imageUrl || "",
            "products.$.description": doc.description || ""
          }
        }
      );
    }

    invalidateCache("product");
    invalidateCache("brand");
    return doc;
  }

  static async delete(id: string): Promise<any | null> {
    const query = buildIdQuery(id);
    const doc = await Product.findOneAndDelete(query).lean().exec();
    const decoded = decodeURIComponent(id).trim();
    // Remove from all brands portfolio lists
    await Brand.updateMany({}, {
      $pull: {
        products: {
          $or: [
            { id },
            { id: decoded },
            { id: { $regex: new RegExp(`^${id}$`, "i") } }
          ]
        } as any
      }
    });
    invalidateCache("product");
    invalidateCache("brand");
    return doc || { id, deleted: true };
  }
}
