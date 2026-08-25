import { Request, Response, NextFunction } from "express";

interface CacheEntry {
  data: any;
  expiresAt: number;
}

const memoryCache = new Map<string, CacheEntry>();
const DEFAULT_TTL_MS = 60 * 1000; // 60 seconds TTL

// Background cleanup interval to prevent memory leaks (runs every 5 minutes)
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of memoryCache.entries()) {
    if (now > entry.expiresAt) {
      memoryCache.delete(key);
    }
  }
}, 5 * 60 * 1000).unref(); // .unref() prevents this timer from blocking Node from exiting

/**
 * Express middleware to cache GET requests in-memory.
 */
export function cacheMiddleware(ttlMs = DEFAULT_TTL_MS) {
  return (req: Request, res: Response, next: NextFunction): void => {
    // Only cache GET requests
    if (req.method !== "GET") {
      return next();
    }

    const key = req.originalUrl || req.url;
    const cached = memoryCache.get(key);

    if (cached && Date.now() < cached.expiresAt) {
      res.setHeader("X-Cache", "HIT");
      res.setHeader("Cache-Control", "public, max-age=30, stale-while-revalidate=60");
      res.json(cached.data);
      return;
    }

    // Intercept res.json to capture response
    const originalJson = res.json.bind(res);
    res.json = ((body: any) => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        memoryCache.set(key, { data: body, expiresAt: Date.now() + ttlMs });
      }
      res.setHeader("X-Cache", "MISS");
      res.setHeader("Cache-Control", "public, max-age=30, stale-while-revalidate=60");
      return originalJson(body);
    }) as any;

    next();
  };
}

/**
 * Clear cache for specific route prefix or all cache.
 */
export function invalidateCache(pattern?: string | RegExp): void {
  if (!pattern) {
    memoryCache.clear();
    console.log("[Cache] Cleared entire in-memory cache.");
    return;
  }

  for (const key of memoryCache.keys()) {
    if (typeof pattern === "string") {
      if (key.includes(pattern)) {
        memoryCache.delete(key);
      }
    } else if (pattern instanceof RegExp) {
      if (pattern.test(key)) {
        memoryCache.delete(key);
      }
    }
  }
  console.log(`[Cache] Invalidated cache matching '${pattern}'.`);
}
