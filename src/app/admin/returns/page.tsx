"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type ReturnRequest = {
  id: string;
  reason: string;
  note: string;
  status: string;
  created_at: string;
  handled_at?: string;
};

type ReturnItem = {
  order_id: string;
  display_id: number;
  email: string;
  total: number;
  currency_code: string;
  fulfillment_status: string;
  payment_status: string;
  created_at: string;
  delivered_at: string | null;
  items: Array<{
    id: string;
    title: string;
    thumbnail?: string;
    quantity: number;
  }>;
  requests: ReturnRequest[];
};

export default function AdminReturnsPage() {
  const router = useRouter();
  const [returns, setReturns] = useState<ReturnItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchReturns = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/returns");
      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setReturns(data.returns || []);
    } catch {
      setError("Failed to load returns");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchReturns();
  }, [fetchReturns]);

  async function handleAction(requestId: string, action: "approved" | "rejected") {
    setProcessingId(requestId);
    try {
      const res = await fetch(`/api/admin/returns/${requestId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });

      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }

      if (!res.ok) throw new Error("Failed");
      await fetchReturns();
    } catch {
      setError("Failed to process return");
    } finally {
      setProcessingId(null);
    }
  }

  async function handleLogout() {
    await fetch("/api/admin/login", { method: "DELETE" });
    router.push("/admin/login");
  }

  const MEDUSA_BACKEND_URL =
    process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000";

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-sm font-medium tracking-wide">Returns Management</h1>
          <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
            {returns.length} pending
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href={`${MEDUSA_BACKEND_URL}/app/orders`}
            target="_blank"
            className="text-[11px] text-black/50 underline hover:no-underline"
          >
            Medusa Admin
          </Link>
          <button
            onClick={handleLogout}
            className="text-[11px] text-red-500 underline hover:no-underline"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-50 border border-red-100 p-4 mb-6">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {loading && (
          <div className="text-center py-12">
            <div className="inline-block w-6 h-6 border-2 border-black/20 border-t-black rounded-full animate-spin" />
          </div>
        )}

        {!loading && returns.length === 0 && (
          <div className="bg-white border border-gray-200 p-12 text-center">
            <p className="text-sm text-black/50">No pending return requests</p>
          </div>
        )}

        {!loading && returns.map((ret) => (
          <div key={ret.order_id} className="bg-white border border-gray-200 mb-4">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <Link
                  href={`${MEDUSA_BACKEND_URL}/app/orders/${ret.order_id}`}
                  target="_blank"
                  className="text-sm font-medium hover:underline"
                >
                  Order #{ret.display_id}
                </Link>
                <p className="text-xs text-gray-500 mt-0.5">{ret.email}</p>
              </div>
              <div className="text-right text-xs text-gray-500">
                <p>{new Date(ret.created_at).toLocaleDateString("en-GB")}</p>
                {ret.delivered_at && (
                  <p className="text-green-600">Delivered {new Date(ret.delivered_at).toLocaleDateString("en-GB")}</p>
                )}
              </div>
            </div>

            <div className="p-4">
              <div className="flex gap-4 mb-4 overflow-x-auto">
                {ret.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-2 text-xs shrink-0">
                    {item.thumbnail ? (
                      <img src={item.thumbnail} alt="" className="w-10 h-12 object-cover bg-gray-50" />
                    ) : (
                      <div className="w-10 h-12 bg-gray-50 flex items-center justify-center text-[8px] text-gray-300">MV</div>
                    )}
                    <div>
                      <p className="text-black/80 max-w-[120px] truncate">{item.title}</p>
                      <p className="text-gray-400">Qty: {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>

              {ret.requests.map((req) => (
                <div key={req.id} className="bg-gray-50 p-3 mb-2 last:mb-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium capitalize mb-1">{req.reason.replace(/_/g, " ")}</p>
                      {req.note && <p className="text-[11px] text-gray-500">{req.note}</p>}
                      <p className="text-[10px] text-gray-400 mt-1">
                        Requested {new Date(req.created_at).toLocaleDateString("en-GB")}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {req.status === "pending" ? (
                        <>
                          <button
                            onClick={() => handleAction(req.id, "approved")}
                            disabled={processingId === req.id}
                            className="text-[11px] bg-green-600 text-white px-3 py-1.5 rounded hover:bg-green-700 transition-colors disabled:opacity-50"
                          >
                            {processingId === req.id ? "..." : "Approve"}
                          </button>
                          <button
                            onClick={() => handleAction(req.id, "rejected")}
                            disabled={processingId === req.id}
                            className="text-[11px] bg-red-500 text-white px-3 py-1.5 rounded hover:bg-red-600 transition-colors disabled:opacity-50"
                          >
                            {processingId === req.id ? "..." : "Reject"}
                          </button>
                        </>
                      ) : (
                        <span
                          className={`text-[10px] font-medium px-2 py-1 rounded-full ${
                            req.status === "approved"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {req.status === "approved" ? "Approved" : "Rejected"}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}
