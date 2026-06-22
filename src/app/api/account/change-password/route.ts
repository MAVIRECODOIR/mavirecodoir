import { NextRequest, NextResponse } from "next/server";
import { changePassword, loginCustomer, getCustomer } from "@/lib/medusa/api";

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("mavire_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { current_password, new_password } = await req.json();

    if (!new_password || new_password.length < 8) {
      return NextResponse.json(
        { error: "New password must be at least 8 characters" },
        { status: 400 }
      );
    }

    // Get customer email from current session
    const customerResult = await getCustomer(token);
    const email = customerResult.customer.email as string;

    // Verify current password by attempting to log in
    try {
      await loginCustomer(email, current_password);
    } catch {
      return NextResponse.json(
        { error: "Current password is incorrect" },
        { status: 403 }
      );
    }

    await changePassword(new_password, token);

    return NextResponse.json({ success: true });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to change password";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
