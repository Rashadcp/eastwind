import { Product, Brand, IProduct } from "../db.js";
import { sanitizeObjectImages } from "../utils/imageStorage.js";
import { invalidateCache } from "../utils/cache.js";

export class ProductModel {
  static async getAll(): Promise<any[]> {
    return await Product.find({}).lean().exec();
  }

  static async getById(id: string): Promise<any | null> {
    let item: any = await Product.findOne({ id }).lean().exec();
    if (!item) {
      const brandWithProd: any = await Brand.findOne({ "products.id": id }).lean().exec();
      if (brandWithProd) {
        const bp = brandWithProd.products?.find((p: any) => p.id === id);
        if (bp) {
          item = {
            id: bp.id,
            slug: `${bp.id}-system`,
            name: bp.name,
            brand: brandWithProd.name,
            category: bp.category || "Foam Equipment",
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
    const sanitized = sanitizeObjectImages(updates, id);

    let doc: any = await Product.findOneAndUpdate({ id }, sanitized, { new: true }).lean().exec();

    // If product was not yet in Product collection (e.g. from seed brand catalog), find & upsert
    if (!doc) {
      const brandWithProd: any = await Brand.findOne({ "products.id": id }).lean().exec();
      const bp = brandWithProd?.products?.find((p: any) => p.id === id);

      const newProductData = {
        id,
        slug: `${id}-system`,
        name: updates.name || bp?.name || id,
        brand: updates.brand || brandWithProd?.name || "One Seven",
        category: updates.category || bp?.category || "Fire Fighting & Rescue Application",
        description: updates.description || bp?.description || "",
        imageUrl: updates.imageUrl || bp?.imageUrl || "",
        features: updates.features || [],
        specifications: updates.specifications || [],
        certifications: updates.certifications || [],
        ...sanitized
      };

      doc = await Product.findOneAndUpdate({ id }, newProductData, { new: true, upsert: true }).lean().exec();
    }

    if (!doc) {
      return null;
    }

    // Sync changes to Brand collection
    const finalBrandName = updates.brand || doc.brand;
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
          { _id: { $ne: targetBrand._id }, "products.id": id },
          { $pull: { products: { id } } }
        );

        // Update or insert into the target brand's products list
        const existingInTarget = targetBrand.products?.some((p: any) => p.id === id);
        if (existingInTarget) {
          await Brand.updateOne(
            { _id: targetBrand._id, "products.id": id },
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
        { "products.id": id },
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
    const doc = await Product.findOneAndDelete({ id }).lean().exec();
    // Remove from all brands portfolio lists
    await Brand.updateMany({}, { $pull: { products: { id } } });
    invalidateCache("product");
    invalidateCache("brand");
    return doc || { id, deleted: true };
  }
}
