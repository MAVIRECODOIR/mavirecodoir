import { NextRequest, NextResponse } from "next/server";
import { getCustomer, getOrders } from "@/lib/medusa/api";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("mavire_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [customerResult, ordersResult] = await Promise.allSettled([
      getCustomer(token),
      getOrders(token),
    ]);

    if (customerResult.status === "rejected") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const customer = customerResult.value.customer;

    const res = NextResponse.json({
      customer: {
        id: customer.id,
        firstName: customer.first_name,
        lastName: customer.last_name,
        email: customer.email,
        phone: customer.phone || null,
        acceptsMarketing: (customer.metadata as Record<string, unknown>)?.accepts_marketing ?? false,
        orders:
          ordersResult.status === "fulfilled"
            ? ordersResult.value.orders.map((o: Record<string, unknown>) => ({
                id: o.id,
                displayId: o.display_id,
                status: o.status,
                total: o.total,
                currencyCode: o.currency_code,
                createdAt: o.created_at,
                items: o.items,
              }))
            : [],
      },
    });

    return res;
  } catch (err) {
    console.error("[me] Error:", err);
    return NextResponse.json(
      { error: "Failed to fetch customer data" },
      { status: 500 }
    );
  }
}
