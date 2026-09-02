export function formatImageUrl(
  url?: string,
  fallback: string = "/products/default-process-instrumentation.png"
): string {
  if (!url || !url.trim()) return fallback;
  let trimmed = url.trim();

  // Clean corrupted trailing backslashes or spaces from pasted/saved base64 strings
  trimmed = trimmed.replace(/[\r\n\s\\]+$/g, "");

  // 1. Data URLs
  if (trimmed.startsWith("data:")) {
    return trimmed;
  }

  // 2. Environment detection
  const isBrowser = typeof window !== "undefined";
  const isLocal = isBrowser
    ? (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")
    : process.env.NODE_ENV === "development";

  // 3. Absolute URLs: rewrite production origin /uploads/ to /api/uploads/ to prevent Nginx 500 errors
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    if (isBrowser && !isLocal) {
      try {
        const parsed = new URL(trimmed);
        if (
          (parsed.hostname === window.location.hostname || parsed.hostname.includes("royalwish.in")) &&
          parsed.pathname.startsWith("/uploads/")
        ) {
          return `${window.location.origin}/api${parsed.pathname}${parsed.search}`;
        }
      } catch {}
    }
    return trimmed;
  }

  // 4. Base URL resolution
  let baseUrl = (process.env.NEXT_PUBLIC_API_URL || "").trim();

  if (!baseUrl) {
    if (isBrowser) {
      baseUrl = isLocal ? "http://localhost:5000" : window.location.origin;
    } else {
      baseUrl = isLocal ? "http://localhost:5000" : "";
    }
  }

  // In production browser, if env accidentally points to localhost, fallback to current origin
  if (isBrowser && !isLocal && (baseUrl.includes("localhost") || baseUrl.includes("127.0.0.1"))) {
    baseUrl = window.location.origin;
  }

  baseUrl = baseUrl.replace(/\/+$/, "");

  // 5. Normalise path
  const normalizedPath = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;

  // 6. Uploaded media assets (/uploads/ or uploads/)
  if (normalizedPath.startsWith("/uploads/")) {
    if (!isLocal) {
      // On production, backend media is reverse-proxied via /api/
      return `${baseUrl}/api${normalizedPath}`;
    }
    return `${baseUrl}${normalizedPath}`;
  }

  // 7. Directly referenced /api/uploads/ paths
  if (normalizedPath.startsWith("/api/uploads/")) {
    return `${baseUrl}${normalizedPath}`;
  }

  // 8. Static frontend assets (e.g. /products/..., /about.png)
  return normalizedPath;
}
