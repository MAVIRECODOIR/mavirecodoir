import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

const SECRET = process.env.SANITY_WEBHOOK_SECRET;

export async function POST(request: NextRequest) {
  const auth = request.headers.get("authorization")?.replace("Bearer ", "");
  if (!SECRET || auth !== SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const docType = body._type || body.data?.type;
  if (!docType) {
    return NextResponse.json({ error: "No document type" }, { status: 400 });
  }

  const tag = `sanity-${docType}`;
  revalidateTag(tag);
  revalidateTag("sanity-journal");

  return NextResponse.json({ revalidated: true, tag });
}
