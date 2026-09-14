import { Request, Response, NextFunction } from "express";

function slugify(text: string): string {
  return String(text)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function validateProduct(req: Request, res: Response, next: NextFunction): void {
  const { name } = req.body;
  if (!name || !String(name).trim()) {
    res.status(400).json({ error: "Product name is required" });
    return;
  }
  if (!req.body.id) {
    req.body.id = slugify(name);
  }
  if (!req.body.brand) {
    req.body.brand = "General Industrial Safety";
  }
  if (!req.body.category) {
    req.body.category = "Safety Equipment";
  }
  next();
}

export function validateSolution(req: Request, res: Response, next: NextFunction): void {
  const { title } = req.body;
  if (!title || !String(title).trim()) {
    res.status(400).json({ error: "Solution title is required" });
    return;
  }
  if (!req.body.id) {
    req.body.id = slugify(title);
  }
  if (!req.body.tagline) {
    req.body.tagline = "";
  }
  if (!req.body.description) {
    req.body.description = "";
  }
  next();
}

export function validateApplication(req: Request, res: Response, next: NextFunction): void {
  const { title } = req.body;
  if (!title || !String(title).trim()) {
    res.status(400).json({ error: "Application title is required" });
    return;
  }
  if (!req.body.id) {
    req.body.id = slugify(title);
  }
  if (!req.body.tagline) {
    req.body.tagline = "";
  }
  if (!req.body.overview) {
    req.body.overview = "";
  }
  next();
}

export function validateService(req: Request, res: Response, next: NextFunction): void {
  const { title } = req.body;
  if (!title || !String(title).trim()) {
    res.status(400).json({ error: "Service title is required" });
    return;
  }
  if (!req.body.id) {
    req.body.id = slugify(title);
  }
  if (!req.body.tagline) {
    req.body.tagline = "";
  }
  if (!req.body.overview) {
    req.body.overview = "";
  }
  next();
}
