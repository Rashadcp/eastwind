// src/utils/apiCache.ts

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const memoryCache = new Map<string, CacheEntry<any>>();
const pendingRequests = new Map<string, Promise<any>>();

const DEFAULT_TTL_MS = 5 * 60 * 1000; // 5 minutes

/**
 * Cached API fetch with Stale-While-Revalidate and In-Flight Request Deduplication
 */
export async function cachedFetch<T = any>(
  url: string,
  options?: {
    ttlMs?: number;
    fallback?: T;
    signal?: AbortSignal;
  }
): Promise<T> {
  const ttl = options?.ttlMs ?? DEFAULT_TTL_MS;
  const now = Date.now();
  const cached = memoryCache.get(url);

  // Return fresh cache immediately
  if (cached && now - cached.timestamp < ttl) {
    return cached.data;
  }

  // Deduplicate concurrent in-flight requests to the same URL
  if (pendingRequests.has(url)) {
    try {
      return await pendingRequests.get(url);
    } catch {
      if (cached) return cached.data;
      if (options?.fallback !== undefined) return options.fallback;
    }
  }

  // Perform the fetch
  const fetchPromise = (async () => {
    try {
      const res = await fetch(url, {
        signal: options?.signal,
        // Allow HTTP cache where supported
        cache: "default",
      });

      if (!res.ok) {
        throw new Error(`Fetch failed with status ${res.status}`);
      }

      const data = await res.json();
      memoryCache.set(url, { data, timestamp: Date.now() });
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
      pendingRequests.delete(url);
    }
  })();

  pendingRequests.set(url, fetchPromise);

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
  const entry = memoryCache.get(url);
  return entry ? (entry.data as T) : null;
}

/**
 * Manually invalidate or update a cache entry
 */
export function invalidateCache(url?: string): void {
  if (url) {
    memoryCache.delete(url);
  } else {
    memoryCache.clear();
  }
}
