// src/app/sitemap.ts
import { MetadataRoute } from "next";
import { productsDb } from "@/data/productsData";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://eastwindsafety.com";
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  // Core static pages
  const staticPages = [
    "",
    "/products",
    "/solutions",
    "/about",
    "/contact",
    "/enquire",
  ].map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  // Fetch Products
  let productEntries: MetadataRoute.Sitemap = [];
  try {
    const res = await fetch(`${baseUrl}/api/products`, { cache: "no-store" });
    const products = res.ok ? await res.json() : productsDb;
    if (Array.isArray(products)) {
      productEntries = products.map((p: any) => ({
        url: `${siteUrl}/products/${p.slug || p.id}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.9,
      }));
    }
  } catch {
    productEntries = productsDb.map((p) => ({
      url: `${siteUrl}/products/${p.slug || p.id}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    }));
  }

  // Fetch Solutions
  let solutionEntries: MetadataRoute.Sitemap = [];
  try {
    const res = await fetch(`${baseUrl}/api/solutions`, { cache: "no-store" });
    if (res.ok) {
      const solutions = await res.json();
      if (Array.isArray(solutions)) {
        solutionEntries = solutions.map((s: any) => ({
          url: `${siteUrl}/solutions/${s.id}`,
          lastModified: new Date(),
          changeFrequency: "monthly" as const,
          priority: 0.85,
        }));
      }
    }
  } catch {
    // ignore
  }

  // Fetch Services
  let serviceEntries: MetadataRoute.Sitemap = [];
  try {
    const res = await fetch(`${baseUrl}/api/services`, { cache: "no-store" });
    if (res.ok) {
      const services = await res.json();
      if (Array.isArray(services)) {
        serviceEntries = services.map((s: any) => ({
          url: `${siteUrl}/services/${s.id}`,
          lastModified: new Date(),
          changeFrequency: "monthly" as const,
          priority: 0.8,
        }));
      }
    }
  } catch {
    // ignore
  }

  // Fetch Applications
  let applicationEntries: MetadataRoute.Sitemap = [];
  try {
    const res = await fetch(`${baseUrl}/api/applications`, { cache: "no-store" });
    if (res.ok) {
      const applications = await res.json();
      if (Array.isArray(applications)) {
        applicationEntries = applications.map((a: any) => ({
          url: `${siteUrl}/applications/${a.id}`,
          lastModified: new Date(),
          changeFrequency: "monthly" as const,
          priority: 0.8,
        }));
      }
    }
  } catch {
    // ignore
  }

  return [
    ...staticPages,
    ...productEntries,
    ...solutionEntries,
    ...serviceEntries,
    ...applicationEntries,
  ];
}
