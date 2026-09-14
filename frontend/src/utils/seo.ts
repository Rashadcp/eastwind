import type { Metadata } from "next";

export interface SeoApiResponse {
  id: string;
  pageKey: string;
  pageName: string;
  path: string;
  title: string;
  description: string;
  keywords: string;
  canonicalUrl: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  robots: string;
  structuredDataJson?: string;
}

export async function getPageMetadata(
  pageKey: string,
  fallbackMetadata: Metadata
): Promise<Metadata> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    const res = await fetch(`${baseUrl}/api/seo/${pageKey}`, {
      next: { revalidate: 60 }
    });

    if (!res.ok) {
      return fallbackMetadata;
    }

    const data: SeoApiResponse = await res.json();
    if (!data || !data.title) {
      return fallbackMetadata;
    }

    const isNoIndex = data.robots ? data.robots.includes("noindex") : false;
    const isNoFollow = data.robots ? data.robots.includes("nofollow") : false;

    return {
      title: data.title,
      description: data.description || (fallbackMetadata.description as string) || "",
      keywords: data.keywords
        ? data.keywords.split(",").map((k) => k.trim())
        : (fallbackMetadata.keywords as string[] | undefined),
      alternates: {
        canonical: data.canonicalUrl || data.path || (fallbackMetadata.alternates?.canonical as string)
      },
      openGraph: {
        title: data.ogTitle || data.title,
        description: data.ogDescription || data.description || "",
        url: data.canonicalUrl || data.path,
        siteName: "Eastwind Energy Arabia",
        images: data.ogImage
          ? [
              {
                url: data.ogImage.startsWith("http")
                  ? data.ogImage
                  : `${baseUrl}${data.ogImage.startsWith("/") ? "" : "/"}${data.ogImage}`,
                width: 1200,
                height: 630,
                alt: data.title
              }
            ]
          : fallbackMetadata.openGraph?.images,
        locale: "en_US",
        type: "website"
      },
      robots: {
        index: !isNoIndex,
        follow: !isNoFollow
      }
    };
  } catch {
    return fallbackMetadata;
  }
}
