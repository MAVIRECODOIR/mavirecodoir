import { NextRequest, NextResponse } from "next/server";
import { getCustomer, updateCustomer } from "@/lib/medusa/api";

function getToken(req: NextRequest): string | undefined {
  return req.cookies.get("mavire_token")?.value;
}

export async function GET(req: NextRequest) {
  try {
    const token = getToken(req);
    if (!token) return NextResponse.json({ items: [] });

    const result = await getCustomer(token);

    if (!result?.customer) return NextResponse.json({ items: [] });

    const metadata = (result.customer?.metadata as Record<string, unknown>) || {};
    const rawWishlist = metadata.wishlist;

    if (!rawWishlist) return NextResponse.json({ items: [] });

    try {
      const parsed =
        typeof rawWishlist === "string"
          ? JSON.parse(rawWishlist)
          : rawWishlist;
      return NextResponse.json({ items: parsed.items ?? [] });
    } catch {
      return NextResponse.json({ items: [] });
    }
  } catch (err) {
    console.error("[wishlist GET]", err);
    return NextResponse.json({ items: [] }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const token = getToken(req);
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const items = body.items ?? [];

    const current = await getCustomer(token);
    const currentMetadata =
      (current.customer?.metadata as Record<string, unknown>) || {};

    await updateCustomer(
      {
        metadata: {
          ...currentMetadata,
          wishlist: JSON.stringify({ items }),
        },
      },
      token
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[wishlist PUT]", err);
    return NextResponse.json(
      { error: "Failed to save wishlist" },
      { status: 500 }
    );
  }
}
