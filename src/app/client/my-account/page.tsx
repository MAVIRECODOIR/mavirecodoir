"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Package, Calendar, User, ChevronDown, ChevronUp, ChevronRight, ShoppingBag, Heart, Truck, Search, RotateCcw, MessageCircle } from "lucide-react";
import { useWishlist } from "@/lib/wishlist";

type OrderItem = {
  id: string;
  display_id: number;
  status: string;
  fulfillment_status: string;
  payment_status: string;
  total: number;
  currency_code: string;
  created_at: string;
  email?: string;
  items?: Array<{
    id: string;
    title: string;
    quantity: number;
    unit_price: number;
    thumbnail?: string;
    variant?: { title: string; product?: { title: string; handle?: string } };
  }>;
};

type Customer = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
} | null;

type Tab = "online" | "in-store";
type Section = "orders" | "wishlist" | "appointments" | "profile" | "track" | "returns";

export default function MyAccountPage() {
  const router = useRouter();
  const [customer, setCustomer] = useState<Customer>(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<Section>("orders");
  const [activeTab, setActiveTab] = useState<Tab>("online");
  const [contactOpen, setContactOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const fetchCustomer = useCallback(async () => {
    try {
      const res = await fetch("/api/account/me");
      if (!res.ok) throw new Error("Unauthorized");
      const data = await res.json();
      setCustomer(data.customer);
      setFormData({
        firstName: data.customer.firstName || "",
        lastName: data.customer.lastName || "",
        phone: data.customer.phone || "",
      });
    } catch {
      router.push("/client/sign-up");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchCustomer();
  }, [fetchCustomer]);

  async function handleLogout() {
    await fetch("/api/account/logout", { method: "POST" });
    router.push("/client/sign-up");
  }

  const wishlist = useWishlist();
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  const fetchOrders = useCallback(async () => {
    setOrdersLoading(true);
    try {
      const res = await fetch("/api/account/orders");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setOrders(data.orders || []);
    } catch {
      setOrders([]);
    } finally {
      setOrdersLoading(false);
    }
  }, []);

  useEffect(() => {
    if (customer) fetchOrders();
  }, [customer, fetchOrders]);

  const NAV_ITEMS: { key: Section; label: string; icon: typeof Package }[] = [
    { key: "orders", label: "My Orders", icon: Package },
    { key: "returns", label: "Returns", icon: RotateCcw },
    { key: "track", label: "Track Order", icon: Search },
    { key: "wishlist", label: "My Wishlist", icon: Heart },
    { key: "appointments", label: "Appointments", icon: Calendar },
    { key: "profile", label: "My Profile", icon: User },
  ];

  /* ═══ PROFILE FORM STATE ═══ */
  const [formData, setFormData] = useState({ firstName: "", lastName: "", phone: "" });
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ ok: boolean; text: string } | null>(null);

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    setProfileSaving(true);
    setProfileMsg(null);
    try {
      const res = await fetch("/api/account/update-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: formData.firstName,
          last_name: formData.lastName,
          phone: formData.phone || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update");
      setProfileMsg({ ok: true, text: "Profile updated" });
      if (data.customer) {
        setCustomer((prev) => (prev ? { ...prev, ...data.customer } : prev));
      }
    } catch (err) {
      setProfileMsg({ ok: false, text: err instanceof Error ? err.message : "Failed to update" });
    } finally {
      setProfileSaving(false);
    }
  }

  /* ═══ PASSWORD FORM STATE ═══ */
  const [pwData, setPwData] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [pwSaving, setPwSaving] = useState(false);
  const [pwMsg, setPwMsg] = useState<{ ok: boolean; text: string } | null>(null);

  async function changePassword(e: React.FormEvent) {
    e.preventDefault();
    setPwMsg(null);
    if (pwData.newPassword.length < 8) {
      setPwMsg({ ok: false, text: "New password must be at least 8 characters" });
      return;
    }
    if (pwData.newPassword !== pwData.confirmPassword) {
      setPwMsg({ ok: false, text: "Passwords do not match" });
      return;
    }
    setPwSaving(true);
    try {
      const res = await fetch("/api/account/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          current_password: pwData.currentPassword,
          new_password: pwData.newPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to change password");
      setPwMsg({ ok: true, text: "Password changed" });
      setPwData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setPwMsg({ ok: false, text: err instanceof Error ? err.message : "Failed to change password" });
    } finally {
      setPwSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-6 w-6 border-2 border-black/20 border-t-black rounded-full animate-spin" />
          <p className="text-xs font-medium tracking-wider uppercase text-black/50">Loading</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex flex-1">
        <aside className="hidden md:flex flex-col w-[355px] border-r border-gray-200 flex-shrink-0 bg-white">
          <div className="flex-1 flex flex-col justify-between overflow-auto">
            <div>
              <h2 className="text-base font-medium tracking-wide px-6 pt-10 pb-6">
                Welcome{customer ? ` ${customer.firstName}` : ""}
              </h2>
              <nav>
                <ul>
                  {NAV_ITEMS.map((item) => (
                    <li key={item.key}>
                      <button
                        onClick={() => setActiveSection(item.key)}
                        className={`flex items-center justify-between w-full px-6 py-2 text-sm transition-colors ${
                          activeSection === item.key
                            ? "font-medium"
                            : "font-normal text-black/70 hover:text-black"
                        }`}
                      >
                        <span className={activeSection === item.key ? "border-b border-black pb-0.5" : ""}>
                          {item.label}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
            <div className="border-t border-gray-100">
              <button
                onClick={() => setContactOpen(!contactOpen)}
                className="flex items-center justify-between w-full px-6 py-4 text-xs font-medium"
              >
                Contact us
                {contactOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              {contactOpen && (
                <div className="px-6 pb-4 space-y-2">
                  <Link href="/client-services" className="block text-xs text-black/60 hover:text-black">Client Services</Link>
                  <Link href="/contact" className="block text-xs text-black/60 hover:text-black">Contact Form</Link>
                  <Link href="/faq" className="block text-xs text-black/60 hover:text-black">FAQ</Link>
                </div>
              )}
            </div>
          </div>
        </aside>

        <div className="md:hidden fixed top-12 left-0 right-0 z-40 bg-white border-b border-gray-200">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex items-center justify-between w-full px-4 py-3 text-sm font-medium"
          >
            <span>{customer ? `Welcome ${customer.firstName}` : "My Account"}</span>
            {mobileMenuOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          {mobileMenuOpen && (
            <div className="border-t border-gray-100 bg-white">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.key}
                  onClick={() => { setActiveSection(item.key); setMobileMenuOpen(false); }}
                  className={`flex items-center gap-3 w-full px-4 py-3 text-sm ${
                    activeSection === item.key ? "font-medium bg-gray-50" : "text-black/70"
                  }`}
                >
                  <item.icon size={14} />
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <main className="flex-1 bg-[#f7f7f7] min-h-screen">

          {/* ═══ ORDERS SECTION ═══ */}
          {activeSection === "orders" && (
            <div>
              <div className="relative w-full aspect-[2/1] min-h-[240px] max-h-[360px] overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=80&auto=format"
                  alt="Orders"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-10 text-white">
                  {orders.length > 0 ? (
                    <>
                      <h2 className="text-base font-medium tracking-wide mb-1">
                        {orders[0].display_id
                          ? `Order #${orders[0].display_id}`
                          : "Latest order"}
                      </h2>
                      <p className="text-xs text-white/70 mb-0">
                        {orders.length} {orders.length === 1 ? "order" : "orders"} total
                      </p>
                    </>
                  ) : (
                    <>
                      <h2 className="text-base font-medium tracking-wide mb-2">You have no ongoing orders</h2>
                      <Link
                        href="/"
                        className="inline-flex items-center gap-2 bg-white text-black text-xs font-medium uppercase tracking-wider px-6 py-3 mt-2 hover:bg-gray-100 transition-colors"
                      >
                        <ShoppingBag size={14} />
                        Start shopping
                      </Link>
                    </>
                  )}
                </div>
              </div>
              <div className="max-w-[840px] mx-auto px-4 py-10 md:py-12">
                <header className="mb-2">
                  <h1 className="text-base font-medium tracking-wide mb-1">Purchase history</h1>
                  <p className="text-xs text-black/60">
                    {orders.length > 0
                      ? `${orders.length} ${orders.length === 1 ? "order" : "orders"} in your history`
                      : "You have no purchases in your history"}
                  </p>
                </header>
                <div className="flex mb-6 border-b border-gray-200">
                  <button
                    onClick={() => setActiveTab("online")}
                    className={`min-w-[172px] text-center py-4 text-xs transition-colors ${
                      activeTab === "online" ? "font-medium border-b-2 border-black" : "font-normal text-black/60 hover:text-black"
                    }`}
                  >
                    Online orders
                  </button>
                  <button
                    onClick={() => setActiveTab("in-store")}
                    className={`min-w-[172px] text-center py-4 text-xs transition-colors ${
                      activeTab === "in-store" ? "font-medium border-b-2 border-black" : "font-normal text-black/60 hover:text-black"
                    }`}
                  >
                    In-store purchases
                  </button>
                </div>

                {activeTab === "online" && (
                  <>
                    {ordersLoading ? (
                      <div className="bg-white text-center py-12">
                        <div className="inline-block w-6 h-6 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                      </div>
                    ) : orders.length === 0 ? (
                      <div className="bg-white text-center py-8 px-6">
                        <p className="text-xs text-black/60">Your online purchases will appear here.</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {orders.map((o) => {
                          const item = o.items?.[0];
                          return (
                            <Link
                              key={o.id}
                              href={`/order/${o.id}`}
                              className="block bg-white border border-gray-200 hover:border-black/30 transition-colors"
                            >
                              <div className="flex items-center gap-4 p-4">
                                {/* Thumbnail */}
                                <div className="w-[52px] h-[65px] bg-gray-50 flex-shrink-0 flex items-center justify-center overflow-hidden">
                                  {item?.thumbnail ? (
                                    <Image
                                      src={item.thumbnail}
                                      alt=""
                                      width={52}
                                      height={65}
                                      className="object-cover w-full h-full"
                                      unoptimized
                                    />
                                  ) : (
                                    <span className="text-[9px] text-gray-300 font-medium tracking-widest">MV</span>
                                  )}
                                </div>
                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
                                    <span>Order #{o.display_id}</span>
                                    <span>&middot;</span>
                                    <span>{new Intl.DateTimeFormat("en-GB", { dateStyle: "medium" }).format(new Date(o.created_at))}</span>
                                  </div>
                                  <p className="text-sm font-medium truncate">
                                    {item?.variant?.product?.title || item?.title || `Order #${o.display_id}`}
                                  </p>
                                  <div className="flex items-center gap-3 mt-1">
                                    <span className="text-xs font-medium">
                                      {new Intl.NumberFormat("en-GB", {
                                        style: "currency",
                                        currency: (o.currency_code || "gbp").toUpperCase(),
                                      }).format((o.total || 0) / 100)}
                                    </span>
                                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full capitalize ${
                                      o.fulfillment_status === "delivered"
                                        ? "bg-green-50 text-green-700"
                                        : o.fulfillment_status === "shipped"
                                        ? "bg-blue-50 text-blue-700"
                                        : o.fulfillment_status === "not_fulfilled"
                                        ? "bg-gray-100 text-gray-500"
                                        : "bg-amber-50 text-amber-700"
                                    }`}>
                                      {o.fulfillment_status.replace(/_/g, " ")}
                                    </span>
                                  </div>
                                </div>
                                <ChevronRight size={16} className="text-gray-300 flex-shrink-0" />
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </>
                )}

                {activeTab === "in-store" && (
                  <div className="bg-white text-center py-8 px-6">
                    <p className="text-xs text-black/60">Your in-store purchases will appear here.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ═══ WISHLIST SECTION ═══ */}
          {activeSection === "wishlist" && (
            <div className="max-w-[840px] mx-auto px-4 py-10 md:py-12">
              <header className="mb-6">
                <h1 className="text-base font-medium tracking-wide mb-1">My Wishlist</h1>
                <p className="text-xs text-black/60">
                  {wishlist.count === 0
                    ? "You have no items in your wishlist"
                    : `${wishlist.count} ${wishlist.count === 1 ? "item" : "items"} saved`}
                </p>
              </header>
              {wishlist.count === 0 ? (
                <div className="bg-white text-center py-12 px-6">
                  <Heart size={32} strokeWidth={1} className="mx-auto mb-4 text-black/30" />
                  <p className="text-sm font-medium text-black/80 mb-1">Your wishlist is empty</p>
                  <p className="text-xs text-black/50 mb-6">Browse our collections and save your favourite pieces</p>
                  <Link href="/" className="inline-block bg-black text-white text-xs font-bold uppercase tracking-wider px-8 py-3 hover:bg-black/85 transition-colors">
                    Explore Collections
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {wishlist.items.map((item) => (
                    <div key={item.productId} className="bg-white group">
                      <div className="relative aspect-[3/4] overflow-hidden">
                        {item.imageUrl ? (
                          <Image src={item.imageUrl} alt={item.title} fill sizes="(max-width: 768px) 50vw, 33vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-500" unoptimized />
                        ) : (
                          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                            <Heart size={24} strokeWidth={1} className="text-black/20" />
                          </div>
                        )}
                        <button onClick={() => wishlist.remove(item.productId)}
                          className="absolute top-3 right-3 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
                          aria-label={`Remove ${item.title} from wishlist`}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41Z" fill="currentColor" />
                          </svg>
                        </button>
                      </div>
                      <div className="p-3">
                        <Link href={`/pr/${item.handle}`} className="block text-sm font-medium text-black hover:underline truncate">{item.title}</Link>
                        {item.variant && <p className="text-xs text-black/50 mt-0.5 truncate">{item.variant}</p>}
                        <p className="text-sm font-medium mt-1">{item.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ═══ APPOINTMENTS SECTION ═══ */}
          {activeSection === "appointments" && (
            <div className="max-w-[840px] mx-auto px-4 py-10 md:py-16">
              <h1 className="text-base font-medium tracking-wide mb-2">Appointments</h1>
              <p className="text-xs text-black/60 mb-8">Manage your private appointments and repair requests</p>
              <div className="bg-white text-center py-12 px-6">
                <Calendar size={32} strokeWidth={1} className="mx-auto mb-4 text-black/30" />
                <p className="text-sm font-medium text-black/80 mb-1">No upcoming appointments</p>
                <p className="text-xs text-black/50 mb-6">Book a private appointment at your nearest MAVIRE boutique</p>
                <Link href="/appointment" className="inline-block bg-black text-white text-xs font-bold uppercase tracking-wider px-8 py-3 hover:bg-black/85 transition-colors">
                  Book Appointment
                </Link>
              </div>
            </div>
          )}

          {/* ═══ TRACK ORDER SECTION ═══ */}
          {activeSection === "track" && (
            <TrackOrderSection orders={orders} onGoToOrders={() => setActiveSection("orders")} />
          )}

          {/* ═══ RETURNS SECTION ═══ */}
          {activeSection === "returns" && (
            <ReturnsSection orders={orders} ordersLoading={ordersLoading} customer={customer} />
          )}

          {/* ═══ PROFILE SECTION ═══ */}
          {activeSection === "profile" && (
            <div className="max-w-[840px] mx-auto px-4 py-10 md:py-16">
              <h1 className="text-base font-medium tracking-wide mb-8">My Profile</h1>

              <div className="space-y-6">
                {/* ── Personal Information ── */}
                <form onSubmit={saveProfile} className="bg-white p-6 md:p-8">
                  <h2 className="text-xs font-medium uppercase tracking-wider text-black/50 mb-6">
                    Personal Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[11px] text-black/50 uppercase tracking-wider mb-1">First Name</label>
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => setFormData((f) => ({ ...f, firstName: e.target.value }))}
                        className="w-full border-b border-gray-300 py-1.5 text-sm outline-none focus:border-black transition-colors bg-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-black/50 uppercase tracking-wider mb-1">Last Name</label>
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => setFormData((f) => ({ ...f, lastName: e.target.value }))}
                        className="w-full border-b border-gray-300 py-1.5 text-sm outline-none focus:border-black transition-colors bg-transparent"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-[11px] text-black/50 uppercase tracking-wider mb-1">Phone</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData((f) => ({ ...f, phone: e.target.value }))}
                        className="w-full border-b border-gray-300 py-1.5 text-sm outline-none focus:border-black transition-colors bg-transparent"
                      />
                    </div>
                  </div>
                  {profileMsg && (
                    <p className={`mt-4 text-xs ${profileMsg.ok ? "text-green-600" : "text-red-600"}`}>
                      {profileMsg.text}
                    </p>
                  )}
                  <button
                    type="submit"
                    disabled={profileSaving}
                    className="mt-6 bg-black text-white text-xs font-bold uppercase tracking-wider px-8 py-3 hover:bg-black/85 transition-colors disabled:opacity-50"
                  >
                    {profileSaving ? "Saving..." : "Save Changes"}
                  </button>
                </form>

                {/* ── Email (read-only) ── */}
                <div className="bg-white p-6 md:p-8">
                  <h2 className="text-xs font-medium uppercase tracking-wider text-black/50 mb-6">Email</h2>
                  <p className="text-sm font-medium">{customer?.email || "—"}</p>
                  <p className="text-xs text-black/40 mt-1">Email cannot be changed at this time</p>
                </div>

                {/* ── Change Password ── */}
                <form onSubmit={changePassword} className="bg-white p-6 md:p-8">
                  <h2 className="text-xs font-medium uppercase tracking-wider text-black/50 mb-6">
                    Change Password
                  </h2>
                  <div className="max-w-sm space-y-5">
                    <div>
                      <label className="block text-[11px] text-black/50 uppercase tracking-wider mb-1">Current Password</label>
                      <input
                        type="password"
                        value={pwData.currentPassword}
                        onChange={(e) => setPwData((f) => ({ ...f, currentPassword: e.target.value }))}
                        className="w-full border-b border-gray-300 py-1.5 text-sm outline-none focus:border-black transition-colors bg-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-black/50 uppercase tracking-wider mb-1">New Password</label>
                      <input
                        type="password"
                        value={pwData.newPassword}
                        onChange={(e) => setPwData((f) => ({ ...f, newPassword: e.target.value }))}
                        className="w-full border-b border-gray-300 py-1.5 text-sm outline-none focus:border-black transition-colors bg-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-black/50 uppercase tracking-wider mb-1">Confirm New Password</label>
                      <input
                        type="password"
                        value={pwData.confirmPassword}
                        onChange={(e) => setPwData((f) => ({ ...f, confirmPassword: e.target.value }))}
                        className="w-full border-b border-gray-300 py-1.5 text-sm outline-none focus:border-black transition-colors bg-transparent"
                      />
                    </div>
                  </div>
                  {pwMsg && (
                    <p className={`mt-4 text-xs ${pwMsg.ok ? "text-green-600" : "text-red-600"}`}>
                      {pwMsg.text}
                    </p>
                  )}
                  <button
                    type="submit"
                    disabled={pwSaving}
                    className="mt-6 bg-black text-white text-xs font-bold uppercase tracking-wider px-8 py-3 hover:bg-black/85 transition-colors disabled:opacity-50"
                  >
                    {pwSaving ? "Changing..." : "Change Password"}
                  </button>
                </form>

                {/* ── Communication Preferences ── */}
                <div className="bg-white p-6 md:p-8">
                  <h2 className="text-xs font-medium uppercase tracking-wider text-black/50 mb-6">
                    Communication Preferences
                  </h2>
                  <p className="text-xs text-black/60 leading-relaxed">
                    Manage your communication preferences to receive updates about new collections,
                    exclusive events, and personalised recommendations from MAVIRE CODOIR.
                  </p>
                </div>

                {/* ── Sign Out ── */}
                <div className="bg-white p-6 md:p-8">
                  <h2 className="text-xs font-medium uppercase tracking-wider text-black/50 mb-6">Account</h2>
                  <button
                    onClick={handleLogout}
                    className="text-xs font-medium uppercase tracking-wider text-black/60 hover:text-black underline"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          )}

          <footer className="border-t border-gray-200 py-2">
            <p className="text-center text-[10px] tracking-wider text-black/30">
              &copy; {new Date().getFullYear()} MAVIRE
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
}

/* ═══ TRACK ORDER COMPONENT ═══ */
type FulfillmentInfo = {
  id: string;
  tracking_links?: Array<{
    id: string;
    tracking_number: string;
    url: string;
    provider_id: string;
  }>;
};

type OrderDetail = OrderItem & {
  fulfillments?: FulfillmentInfo[];
  shipping_address?: {
    first_name: string;
    last_name: string;
    address_1: string;
    city: string;
    postal_code: string;
    country_code: string;
  };
  shipping_methods?: Array<{
    name: string;
    amount: number;
  }>;
};

function TrackOrderSection({ orders, onGoToOrders }: { orders: OrderItem[]; onGoToOrders: () => void }) {
  const router = useRouter();
  const [trackingOrders, setTrackingOrders] = useState<OrderDetail[]>([]);
  const [loading, setLoading] = useState(true);

  const trackableStatuses = [
    "shipped", "partially_shipped",
    "fulfilled", "partially_fulfilled",
    "delivered", "partially_delivered",
  ];

  useEffect(() => {
    const trackable = orders.filter((o) =>
      trackableStatuses.includes(o.fulfillment_status)
    );
    if (trackable.length === 0) {
      setTrackingOrders([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    Promise.all(
      trackable.map((o) =>
        fetch(`/api/order/${o.id}`, { credentials: "include" })
          .then((r) => (r.ok ? r.json() : null))
          .then((d) => d?.order || d || null)
          .catch(() => null)
      )
    )
      .then((results) => setTrackingOrders(results.filter(Boolean)))
      .finally(() => setLoading(false));
  }, [orders]);

  return (
    <div className="max-w-[840px] mx-auto px-4 py-10 md:py-16">
      <h1 className="text-base font-medium tracking-wide mb-1">Track your order</h1>
      <p className="text-xs text-black/60 mb-8">
        Track all your shipped orders in one place. Tracking numbers and carriers are listed below.
      </p>

      {loading ? (
        <div className="bg-white text-center py-12">
          <div className="inline-block w-6 h-6 border-2 border-black/20 border-t-black rounded-full animate-spin" />
        </div>
      ) : trackingOrders.length === 0 ? (
        <div className="bg-white text-center py-12 px-6 border border-gray-200">
          <Truck size={32} strokeWidth={1} className="mx-auto mb-4 text-black/30" />
          <p className="text-sm text-black/80 font-medium mb-1">No items to track yet</p>
          <p className="text-xs text-black/50 mb-6 max-w-sm mx-auto">
            Once your order has been shipped, tracking details will appear here.
            Check your{" "}
            <button
              onClick={onGoToOrders}
              className="text-black underline hover:no-underline inline bg-transparent border-0 p-0 cursor-pointer"
            >
              order history
            </button>{" "}
            to see all your purchases.
          </p>
          <button
            onClick={onGoToOrders}
            className="inline-block bg-black text-white text-xs font-medium uppercase tracking-wider px-8 py-3 hover:bg-black/85 transition-colors"
          >
            View order history
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {trackingOrders.map((order) => {
            const fulfillments = order.fulfillments || [];
            const allLinks = fulfillments.flatMap((f) => f.tracking_links || []);
            const firstItem = order.items?.[0];
            return (
              <div key={order.id} className="bg-white border border-gray-200">
                <div className="flex items-center gap-4 p-4 border-b border-gray-100">
                  <div className="w-[52px] h-[65px] bg-gray-50 flex-shrink-0 flex items-center justify-center overflow-hidden">
                    {firstItem?.thumbnail ? (
                      <img
                        src={firstItem.thumbnail}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-[9px] text-gray-300 font-medium tracking-widest">MV</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-400 mb-0.5">Order #{order.display_id}</p>
                    <p className="text-sm font-medium truncate">
                      {firstItem?.variant?.product?.title || firstItem?.title || `Order #${order.display_id}`}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full capitalize ${
                        order.fulfillment_status === "delivered" || order.fulfillment_status === "partially_delivered"
                          ? "bg-green-50 text-green-700"
                          : "bg-blue-50 text-blue-700"
                      }`}>
                        {order.fulfillment_status.replace(/_/g, " ")}
                      </span>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-gray-300 flex-shrink-0" />
                </div>

                {allLinks.length > 0 && (
                  <div className="px-4 py-3 space-y-2">
                    {allLinks.map((link) => (
                      <div key={link.id} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-black/50 uppercase tracking-wider text-[10px] shrink-0">
                            {link.provider_id?.replace(/_/g, " ") || "Carrier"}:
                          </span>
                          <span className="font-medium truncate">{link.tracking_number}</span>
                        </div>
                        {link.url && (
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-black underline hover:no-underline shrink-0 ml-2"
                          >
                            Track
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <div className="border-t border-gray-100 px-4 py-3">
                  <button
                    onClick={() => router.push(`/order/${order.id}`)}
                    className="w-full bg-black text-white text-[11px] font-medium uppercase tracking-wider py-2.5 hover:bg-black/85 transition-colors"
                  >
                    View order details
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ═══ RETURNS SECTION ═══ */
function ReturnInfo({ orderId }: { orderId: string }) {
  const [info, setInfo] = useState<{
    delivered_at: string | null;
    deadline: string | null;
    days_remaining: number | null;
    eligible: boolean;
    expired: boolean;
    not_delivered_yet: boolean;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/order/${orderId}/return-info`, { credentials: "include" });
        if (!res.ok) throw new Error("Failed");
        const data = await res.json();
        setInfo(data);
      } catch {} finally {
        setLoading(false);
      }
    })();
  }, [orderId]);

  if (loading) return <span className="text-[10px] text-gray-400">Loading...</span>;
  if (!info) return null;

  if (info.not_delivered_yet) {
    return <span className="text-[10px] text-gray-400">Awaiting delivery</span>;
  }

  if (info.expired) {
    return <span className="text-[10px] text-red-400">Return window closed</span>;
  }

  if (info.eligible) {
    return (
      <span className="text-[10px] text-green-600">
        {info.days_remaining} day{info.days_remaining !== 1 ? "s" : ""} left to return
      </span>
    );
  }

  return null;
}

function ReturnsSection({
  orders,
  ordersLoading,
  customer,
}: {
  orders: OrderItem[];
  ordersLoading: boolean;
  customer: { id: string; email: string } | null;
}) {
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [returnReason, setReturnReason] = useState("");
  const [returnNote, setReturnNote] = useState("");
  const [submitMsg, setSubmitMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [submittedReturns, setSubmittedReturns] = useState<string[]>([]);

  const returnableOrders = orders.filter(
    (o) => o.fulfillment_status === "delivered" || o.fulfillment_status === "shipped"
  );
  const pastOrders = orders.filter(
    (o) => o.fulfillment_status !== "delivered" && o.fulfillment_status !== "shipped"
  );

  async function handleSubmitReturn(orderId: string) {
    if (!returnReason.trim()) return;
    const order = orders.find((o) => o.id === orderId);
    const displayId = order?.display_id || "";

    // Submit to API (also opens mailto as fallback)
    try {
      const res = await fetch(`/api/order/${orderId}/return`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ reason: returnReason, note: returnNote }),
      });
      if (res.ok) {
        setSubmitMsg({ ok: true, text: "Return request submitted. We'll review and email you within 1-2 business days." });
      }
    } catch {}

    const subject = `Return Request - Order #${displayId}`;
    const body = `Order #: ${displayId}\nCustomer: ${customer?.email || ""}\nReason: ${returnReason}\nNotes: ${returnNote}`;
    window.open(`mailto:returns@mavirecodoir.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
    setSubmittedReturns((prev) => [...prev, orderId]);
    setReturnReason("");
    setReturnNote("");
    setExpandedOrder(null);
    setTimeout(() => setSubmitMsg(null), 5000);
  }

  return (
    <div className="max-w-[840px] mx-auto px-4 py-10 md:py-16">
      <h1 className="text-base font-medium tracking-wide mb-1">Returns</h1>
      <p className="text-xs text-black/60 mb-8">
        {customer
          ? "Request a return for delivered items or track existing requests."
          : "Sign in to track your return requests. Guest return updates are sent via email."
        }
      </p>

      {!customer && (
        <div className="bg-white text-center py-12 px-6 border border-gray-200">
          <MessageCircle size={32} strokeWidth={1} className="mx-auto mb-4 text-black/30" />
          <p className="text-sm text-black/80 font-medium mb-1">Return updates sent via email</p>
          <p className="text-xs text-black/50 mb-6 max-w-sm mx-auto">
            We&apos;ve sent updates about your return to your email address. 
            <Link href="/client/sign-up" className="text-black underline hover:no-underline ml-1">
              Sign in
            </Link> to view all return requests in one place.
          </p>
        </div>
      )}

      {customer && ordersLoading && (
        <div className="bg-white text-center py-12">
          <div className="inline-block w-6 h-6 border-2 border-black/20 border-t-black rounded-full animate-spin" />
        </div>
      )}

      {customer && !ordersLoading && returnableOrders.length === 0 && (
        <div className="bg-white text-center py-12 px-6 border border-gray-200">
          <RotateCcw size={32} strokeWidth={1} className="mx-auto mb-4 text-black/30" />
          <p className="text-sm text-black/80 font-medium mb-1">No items eligible for return</p>
          <p className="text-xs text-black/50">
            Items become eligible once shipped or delivered. Check back after your next order arrives.
          </p>
        </div>
      )}

      {/* Eligible orders with return window */}
      {customer && returnableOrders.length > 0 && (
        <div className="mb-2 px-1">
          <p className="text-[11px] text-black/40 uppercase tracking-wider">
            Return window: 30 days from delivery
          </p>
        </div>
      )}

      {customer && returnableOrders.map((o) => {
        const firstItem = o.items?.[0];
        return (
          <div key={o.id} className="bg-white border border-gray-200 mb-4">
            <div className="flex items-center gap-4 p-4">
              <div className="w-[52px] h-[65px] bg-gray-50 flex-shrink-0 flex items-center justify-center overflow-hidden">
                {firstItem?.thumbnail ? (
                  <img src={firstItem.thumbnail} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-[9px] text-gray-300 font-medium tracking-widest">MV</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-400 mb-0.5">Order #{o.display_id}</p>
                <p className="text-sm font-medium truncate">
                  {firstItem?.variant?.product?.title || firstItem?.title || `Order #${o.display_id}`}
                </p>
                <p className="text-xs text-gray-500 capitalize mb-1">{o.fulfillment_status.replace(/_/g, " ")}</p>
                <ReturnInfo orderId={o.id} />
              </div>
              {submittedReturns.includes(o.id) ? (
                <span className="text-[10px] text-green-600 bg-green-50 px-2 py-1 rounded-full font-medium flex-shrink-0">
                  Return requested
                </span>
              ) : (
              <button
                onClick={() => setExpandedOrder(expandedOrder === o.id ? null : o.id)}
                className="text-xs font-medium uppercase tracking-wider border border-black px-4 py-2 hover:bg-black hover:text-white transition-colors flex-shrink-0"
              >
                {expandedOrder === o.id ? "Cancel" : "Return"}
              </button>
              )}
            </div>

            {expandedOrder === o.id && (
              <div className="border-t border-gray-100 p-4 space-y-4">
                <p className="text-xs text-black/60">
                  Please tell us why you&apos;re returning this item. We&apos;ll review and send instructions within 1-2 business days.
                </p>
                <div>
                  <label className="block text-[11px] text-black/50 uppercase tracking-wider mb-1">Reason</label>
                  <select
                    value={returnReason}
                    onChange={(e) => setReturnReason(e.target.value)}
                    className="w-full border border-gray-300 px-3 py-2 text-sm outline-none focus:border-black transition-colors bg-white"
                  >
                    <option value="">Select a reason</option>
                    <option value="size_not_correct">Size not correct</option>
                    <option value="changed_mind">Changed my mind</option>
                    <option value="defective">Defective / damaged</option>
                    <option value="not_as_described">Not as described</option>
                    <option value="wrong_item">Wrong item received</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] text-black/50 uppercase tracking-wider mb-1">Notes (optional)</label>
                  <textarea
                    value={returnNote}
                    onChange={(e) => setReturnNote(e.target.value)}
                    rows={3}
                    className="w-full border border-gray-300 px-3 py-2 text-sm outline-none focus:border-black transition-colors resize-none"
                    placeholder="Tell us more about the issue..."
                  />
                </div>
                {submitMsg && (
                  <p className={`text-xs ${submitMsg.ok ? "text-green-600" : "text-red-600"}`}>
                    {submitMsg.text}
                  </p>
                )}
                <button
                  onClick={() => handleSubmitReturn(o.id)}
                  disabled={!returnReason.trim()}
                  className="bg-black text-white text-xs font-medium uppercase tracking-wider px-6 py-2.5 hover:bg-black/85 transition-colors disabled:opacity-50"
                >
                  Open email client
                </button>
              </div>
            )}
          </div>
        );
      })}

      {/* Submitted returns */}
      {customer && submittedReturns.length > 0 && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200">
          <h3 className="text-xs font-medium uppercase tracking-wider text-green-800 mb-2">Submitted returns</h3>
          <div className="space-y-2">
            {orders
              .filter((o) => submittedReturns.includes(o.id))
              .map((o) => (
                <div key={o.id} className="flex items-center justify-between text-sm">
                  <span>Order #{o.display_id}</span>
                  <span className="text-[10px] text-green-600 bg-green-100 px-2 py-0.5 rounded-full">Pending review</span>
                </div>
              ))}
          </div>
          <p className="text-[11px] text-green-700 mt-2">
            We&apos;ll email you at {customer?.email} with next steps within 1-2 business days.
          </p>
        </div>
      )}

      {/* Past orders (non-returnable) */}
      {customer && pastOrders.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xs font-medium uppercase tracking-wider text-black/50 mb-3">Past orders</h3>
          <div className="space-y-2">
            {pastOrders.map((o) => (
              <div key={o.id} className="bg-white border border-gray-200 px-4 py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm">Order #{o.display_id}</p>
                  <p className="text-xs text-gray-500 capitalize">{o.fulfillment_status.replace(/_/g, " ")}</p>
                </div>
                <span className="text-[10px] text-gray-400">Not eligible</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Return policy */}
      <div className="mt-8 bg-white border border-gray-200 p-6">
        <p className="text-xs font-medium uppercase tracking-wider mb-2">Return Policy</p>
        <div className="text-xs text-black/60 space-y-2 leading-relaxed">
          <p>Items must be returned within <strong>30 days of delivery</strong> in their original condition — unworn, unwashed, and with all <strong>tags attached</strong>.</p>
          <p>Returns that are worn, altered, damaged, or missing tags may be rejected or subject to a restocking fee.</p>
          <p>Once approved, you&apos;ll receive a prepaid return label via email. Refunds are processed within 5–7 business days after we receive the item.</p>
          <p>Footwear must be returned in the original shoebox. Fragrance and cosmetics must be unopened and sealed. Final sale items cannot be returned.</p>
          <Link href="/shipping" className="inline-block mt-2 text-black underline hover:no-underline text-xs">
            View full shipping & returns policy
          </Link>
        </div>
      </div>
    </div>
  );
}
