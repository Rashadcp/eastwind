import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config.js";

export interface AuthenticatedRequest extends Request {
  admin?: {
    username: string;
  };
}

export function requireAdmin(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ error: "Access denied. No authorization token provided." });
      return;
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      res.status(401).json({ error: "Access denied. Invalid token format." });
      return;
    }

    // Verify and decode JWT
    const decoded = jwt.verify(token, JWT_SECRET) as { username: string };
    
    // Inject admin properties into the request object
    (req as AuthenticatedRequest).admin = {
      username: decoded.username
    };

    next();
  } catch (error: any) {
    console.error("JWT verification failure:", error.message);
    res.status(401).json({ error: "Access denied. Token is expired or invalid." });
  }
}
