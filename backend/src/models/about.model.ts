import { AboutContent, IAboutContent } from "../db.js";
import { sanitizeObjectImages } from "../utils/imageStorage.js";
import { invalidateCache } from "../utils/cache.js";

export class AboutModel {
  static async getAll(): Promise<IAboutContent[]> {
    const docs = await AboutContent.find({}).lean().exec();
    return (docs as unknown) as IAboutContent[];
  }

  static async getBySection(id: string): Promise<IAboutContent | null> {
    let item = await AboutContent.findOne({ id }).lean().exec();
    if (!item && id === "home") {
      item = await AboutContent.findOneAndUpdate(
        { id: "home" },
        {
          id: "home",
          imageUrl: "/products/default-process-instrumentation.png",
          title: "Sustaining Regional Safety Infrastructure",
          overviewText: "East Wind operates as a regional, end-to-end safety solutions provider delivering the complete lifecycle of safety projects across mission-critical infrastructure segments.",
          secondaryText: "Our core strength centers on adopting and implementing the latest safety technologies to solve complex, high-risk challenges—improving safety performance while reducing total cost of ownership (TCO) for our clients.",
          metrics: [
            {
              value: "70%",
              label: "Technical Functions Weight",
              desc: "Dedicated to application engineering, cross-disciplinary integration, workshops, and instrument field services."
            },
            {
              value: "10+",
              label: "Certified Personnel Scale",
              desc: "Housing internal multi-disciplinary functions spanning mechanical, electrical, and functional safety architecture."
            }
          ],
          lifecycleSteps: [
            "Concept Studies & Solution Selection",
            "Safety Systems Integration",
            "Manufacturing & Assembly",
            "Installation & Commissioning",
            "Project Management Leadership",
            "Long-Term After-Sales Support"
          ]
        },
        { new: true, upsert: true }
      ).lean().exec();
    }
    return (item as unknown) as IAboutContent | null;
  }

  static async upsertSection(id: string, data: Partial<IAboutContent>): Promise<IAboutContent> {
    const sanitized = sanitizeObjectImages(data, `about_${id}`);
    const doc = await AboutContent.findOneAndUpdate(
      { id },
      { ...sanitized, id },
      { new: true, upsert: true }
    ).lean().exec();
    invalidateCache("about");
    return (doc as unknown) as IAboutContent;
  }
}
