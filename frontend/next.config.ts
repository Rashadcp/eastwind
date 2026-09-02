import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compress: true,
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
  async headers() {
    return [
      {
        source: "/hero-frames/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/products/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=604800",
          },
        ],
      },
      {
        source: "/uploads/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=2592000, immutable",
          },
        ],
      },
      {
        source: "/api/uploads/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=2592000, immutable",
          },
        ],
      },
    ];
  },
  async rewrites() {
    // Internal proxy should ALWAYS use local loopback to avoid self-referential TLS loops & ECONNRESET
    const backendPort = process.env.PORT || "5100";
    let internalBackend = process.env.INTERNAL_BACKEND_URL;
    if (!internalBackend) {
      const publicUrl = (process.env.NEXT_PUBLIC_API_URL || "").trim();
      if (publicUrl.includes("localhost") || publicUrl.includes("127.0.0.1")) {
        internalBackend = publicUrl;
      } else {
        // In production or when public URL is a domain (e.g. royalwish.in), proxy locally
        internalBackend = `http://127.0.0.1:${backendPort}`;
      }
    }
    internalBackend = internalBackend.replace(/\/+$/, "");

    return [
      {
        source: "/uploads/:path*",
        destination: `${internalBackend}/uploads/:path*`,
      },
      {
        source: "/api/uploads/:path*",
        destination: `${internalBackend}/uploads/:path*`,
      },
    ];
  },
};

export default nextConfig;
