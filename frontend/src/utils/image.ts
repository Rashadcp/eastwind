export function formatImageUrl(
  url?: string,
  fallback: string = "/products/default-process-instrumentation.png"
): string {
  if (!url || !url.trim()) return fallback;
  let trimmed = url.trim();

  // Clean corrupted trailing backslashes or spaces from pasted/saved base64 strings
  trimmed = trimmed.replace(/[\r\n\s\\]+$/g, "");

  // 1. Data URLs or absolute HTTP/HTTPS URLs
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://") || trimmed.startsWith("data:")) {
    return trimmed;
  }

  // 2. Base URL resolution for local vs production
  let baseUrl = (process.env.NEXT_PUBLIC_API_URL || "").trim();

  if (!baseUrl) {
    if (typeof window !== "undefined") {
      const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
      baseUrl = isLocal ? "http://localhost:5000" : window.location.origin;
    } else {
      baseUrl = "http://localhost:5000";
    }
  }

  // In production browser, if env contains localhost, fallback to current origin
  if (typeof window !== "undefined") {
    const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
    if (!isLocal && (baseUrl.includes("localhost") || baseUrl.includes("127.0.0.1"))) {
      baseUrl = window.location.origin;
    }
  }

  baseUrl = baseUrl.replace(/\/+$/, "");

  if (trimmed.startsWith("/uploads/")) {
    return `${baseUrl}${trimmed}`;
  }

  if (trimmed.startsWith("uploads/")) {
    return `${baseUrl}/${trimmed}`;
  }

  if (!trimmed.startsWith("/")) {
    return `/${trimmed}`;
  }

  return trimmed;
}
