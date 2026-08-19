import { Request, Response, NextFunction } from "express";

export function validateProduct(req: Request, res: Response, next: NextFunction): void {
  const { id, name, brand, category } = req.body;
  if (!id || !name || !brand || !category) {
    res.status(400).json({ error: "Missing required fields (id, name, brand, category)" });
    return;
  }
  next();
}

export function validateSolution(req: Request, res: Response, next: NextFunction): void {
  const { id, title, tagline, description } = req.body;
  if (!id || !title || !tagline || !description) {
    res.status(400).json({ error: "Missing required fields (id, title, tagline, description)" });
    return;
  }
  next();
}

export function validateApplication(req: Request, res: Response, next: NextFunction): void {
  const { id, title, tagline, overview } = req.body;
  if (!id || !title || !tagline || !overview) {
    res.status(400).json({ error: "Missing required fields (id, title, tagline, overview)" });
    return;
  }
  next();
}

export function validateService(req: Request, res: Response, next: NextFunction): void {
  const { id, title, tagline, overview } = req.body;
  if (!id || !title || !tagline || !overview) {
    res.status(400).json({ error: "Missing required fields (id, title, tagline, overview)" });
    return;
  }
  next();
}
