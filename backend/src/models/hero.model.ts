import mongoose, { Schema, Document } from "mongoose";

export interface IHero extends Document {
  id: string;
  slide1Tagline: string;
  slide1Title: string;
  slide1Desc: string;
  slide1Btn1Text: string;
  slide1Btn2Text: string;
  slide2Tagline: string;
  slide2Title: string;
  slide2Desc: string;
  slide2Btn1Text: string;
}

const HeroSchema: Schema = new Schema(
  {
    id: { type: String, required: true, unique: true, default: "hero_settings" },
    slide1Tagline: { type: String, default: "Safety Arabia Infrastructure" },
    slide1Title: { type: String, default: "Fusing Industry AI & Critical Safety" },
    slide1Desc: { type: String, default: "We engineer intelligent, cyber-physical safety systems. From explosion-proof IIoT mobility to predictive threat analytics, we safeguard heavy industrial infrastructure." },
    slide1Btn1Text: { type: String, default: "Operations Center" },
    slide1Btn2Text: { type: String, default: "Our Capabilities" },
    slide2Tagline: { type: String, default: "IIoT Data Telemetry Loops" },
    slide2Title: { type: String, default: "Real-time Edge Acquisition" },
    slide2Desc: { type: String, default: "Deploying intrinsically safe wireless sensor webs inside explosive gas zones. Fusing critical network monitoring architecture protocols into a unified digital operations environment." },
    slide2Btn1Text: { type: String, default: "Explore MIMES Wireless" },
  },
  { timestamps: true }
);

export default mongoose.model<IHero>("Hero", HeroSchema);
