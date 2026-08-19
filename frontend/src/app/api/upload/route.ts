import { NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided in form data" },
        { status: 400 }
      );
    }

    const backendFormData = new FormData();
    backendFormData.append("file", file);

    const res = await fetch(`${BACKEND_URL}/api/upload`, {
      method: "POST",
      body: backendFormData,
    });

    if (!res.ok) {
      const errText = await res.text();
      return NextResponse.json({ error: errText }, { status: res.status });
    }

    const result = await res.json();
    return NextResponse.json(result, { status: 201 });
  } catch (err: any) {
    console.error("File upload proxy error:", err);
    return NextResponse.json(
      { error: "Internal server error during upload proxy: " + err.message },
      { status: 500 }
    );
  }
}
