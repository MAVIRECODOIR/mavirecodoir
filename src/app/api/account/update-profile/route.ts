import { NextRequest, NextResponse } from "next/server";
import { updateCustomer } from "@/lib/medusa/api";

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("mavire_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { first_name, last_name, phone } = body;

    const payload: Record<string, unknown> = {};
    if (first_name !== undefined) payload.first_name = first_name;
    if (last_name !== undefined) payload.last_name = last_name;
    if (phone !== undefined) payload.phone = phone;

    if (!Object.keys(payload).length) {
      return NextResponse.json(
        { error: "No fields to update" },
        { status: 400 }
      );
    }

    const result = await updateCustomer(payload, token);

    return NextResponse.json({
      success: true,
      customer: {
        id: result.customer.id,
        firstName: result.customer.first_name,
        lastName: result.customer.last_name,
        email: result.customer.email,
        phone: result.customer.phone || null,
      },
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to update profile";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
