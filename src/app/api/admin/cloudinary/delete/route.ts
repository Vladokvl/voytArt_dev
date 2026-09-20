import { NextResponse } from "next/server";
import { auth } from "~/auth";
import { deleteAssetByUrl } from "~/lib/cloudinary";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    let body: { urls?: string[]; url?: string } = {};
    try {
      const text = await req.text();
      body = JSON.parse(text) as { urls?: string[]; url?: string };
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const urls: string[] = Array.isArray(body.urls)
      ? body.urls
      : typeof body.url === "string"
        ? [body.url]
        : [];

    if (urls.length > 0) {
      await Promise.allSettled(urls.map((u) => deleteAssetByUrl(u)));
    }

    return NextResponse.json({ success: true, count: urls.length });
  } catch (err) {
    console.error("Cloudinary delete route error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
