import { NextResponse } from "next/server";

const BACKEND_URL =
  process.env.INTERNAL_BACKEND_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000";

export async function GET() {
  try {
    const res = await fetch(`${BACKEND_URL}/api/contact-settings`, {
      cache: "no-store",
    });
    if (res.ok) {
      const list = await res.json();
      if (Array.isArray(list)) {
        const footerDoc = list.find((item: any) => item.id === "footer");
        if (footerDoc) {
          return NextResponse.json(
            {
              logoUrl: footerDoc.logoUrl || "/logo.png",
              companyName: "Eastwind Energy Arabia",
              ...footerDoc,
            },
            { status: 200 }
          );
        }
      }
    }
  } catch {
    // Fallback gracefully if backend is temporarily unreachable
  }

  return NextResponse.json(
    {
      logoUrl: "/logo.png",
      companyName: "Eastwind Energy Arabia",
    },
    { status: 200 }
  );
}
