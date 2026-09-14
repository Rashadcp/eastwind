// src/utils/apiCache.ts

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const memoryCache = new Map<string, CacheEntry<any>>();
const pendingRequests = new Map<string, Promise<any>>();

const DEFAULT_TTL_MS = 10 * 1000; // 10 seconds default TTL (avoids serving stale data after admin edits)

function normalizeCacheKey(rawUrl: string): string {
  try {
    const isAbsolute = rawUrl.startsWith("http://") || rawUrl.startsWith("https://");
    const u = new URL(rawUrl, "http://localhost");
    u.searchParams.delete("t");
    u.searchParams.delete("_");
    u.searchParams.delete("timestamp");
    if (isAbsolute) {
      return u.toString();
    }
    const qs = u.searchParams.toString();
    return u.pathname + (qs ? `?${qs}` : "");
  } catch {
    return rawUrl;
  }
}

/**
 * Cached API fetch with Stale-While-Revalidate and In-Flight Request Deduplication
 */
export async function cachedFetch<T = any>(
  url: string,
  options?: {
    ttlMs?: number;
    fallback?: T;
    signal?: AbortSignal;
    cache?: RequestCache;
  }
): Promise<T> {
  const cacheKey = normalizeCacheKey(url);
  const ttl = options?.ttlMs ?? DEFAULT_TTL_MS;
  const now = Date.now();
  const cached = memoryCache.get(cacheKey);

  // Return fresh cache immediately if within TTL
  if (cached && now - cached.timestamp < ttl) {
    return cached.data;
  }

  // Deduplicate concurrent in-flight requests to the same URL
  if (pendingRequests.has(cacheKey)) {
    try {
      return await pendingRequests.get(cacheKey);
    } catch {
      if (cached) return cached.data;
      if (options?.fallback !== undefined) return options.fallback;
    }
  }

  // Perform the fetch with no-store to ensure latest dynamic database content
  const fetchPromise = (async () => {
    try {
      const res = await fetch(url, {
        signal: options?.signal,
        cache: options?.cache ?? "no-store",
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          "Pragma": "no-cache",
        },
      });

      if (!res.ok) {
        throw new Error(`Fetch failed with status ${res.status}`);
      }

      const data = await res.json();
      memoryCache.set(cacheKey, { data, timestamp: Date.now() });
      return data as T;
    } catch (err) {
      // If network fails or times out, return stale cache if available
      if (cached) {
        return cached.data;
      }
      if (options?.fallback !== undefined) {
        return options.fallback;
      }
      throw err;
    } finally {
      pendingRequests.delete(cacheKey);
    }
  })();

  pendingRequests.set(cacheKey, fetchPromise);

  // If we have stale cache, return it immediately while the background request updates the cache (SWR)
  if (cached) {
    return cached.data;
  }

  return await fetchPromise;
}

/**
 * Helper to get existing cached value without awaiting network
 */
export function getCached<T>(url: string): T | null {
  const cacheKey = normalizeCacheKey(url);
  const entry = memoryCache.get(cacheKey);
  return entry ? (entry.data as T) : null;
}

/**
 * Manually invalidate or update a cache entry
 */
export function invalidateCache(url?: string): void {
  if (url) {
    const cacheKey = normalizeCacheKey(url);
    memoryCache.delete(cacheKey);
    for (const k of memoryCache.keys()) {
      if (k.includes(url) || k.includes(cacheKey)) {
        memoryCache.delete(k);
      }
    }
  } else {
    memoryCache.clear();
  }
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("cms-cache-cleared", { detail: { url } }));
  }
}
