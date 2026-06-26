"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import Backdrop from "../ui/Backdrop";
import LocalizedLink from "../LocalizedLink";
import { useTranslations } from "next-intl";

/* ─── Chevron arrow icon ─── */
function ChevronIcon({
  className,
  size = 16,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}

/* ─── Animated close X ─── */
function CloseX({
  onClick,
  isMobile,
}: {
  onClick: () => void;
  isMobile: boolean;
}) {
  const t = useTranslations("common");
  return (
    <button
      onClick={onClick}
      aria-label={t("close")}
      className="flex items-center gap-1.5 relative z-[302] p-0 m-0 border-0 bg-transparent cursor-pointer"
      style={{
        font: `500 ${isMobile ? 17 : 14}px/${isMobile ? 21 : 17}px inherit`,
        color: "rgb(51, 56, 60)",
      }}
    >
      <span
        className="flex items-center justify-center"
        style={{ width: isMobile ? 18 : 14, height: isMobile ? 18 : 14 }}
      >
        <svg
          width={isMobile ? 18 : 14}
          height={isMobile ? 18 : 14}
          viewBox="0 0 14 14"
          fill="none"
          aria-hidden="true"
        >
          <line
            x1="0"
            y1="7"
            x2="14"
            y2="7"
            stroke="currentColor"
            strokeWidth="1.2"
            style={{
              transformOrigin: "7px 7px",
              transform: "rotate(45deg)",
              transition: "transform 0.3s cubic-bezier(0.31, 0, 0.13, 1)",
            }}
          />
          <line
            x1="0"
            y1="7"
            x2="14"
            y2="7"
            stroke="currentColor"
            strokeWidth="1.2"
            style={{
              transformOrigin: "7px 7px",
              transform: "rotate(-45deg)",
              transition: "transform 0.3s cubic-bezier(0.31, 0, 0.13, 1)",
            }}
          />
        </svg>
      </span>
      <span>{t("close")}</span>
    </button>
  );
}

type NavItem = {
  label: string;
  href: string;
  children?: NavItem[];
};

const NAV_DATA: NavItem[] = [
  {
    label: "New Arrivals",
    href: "/new-arrivals",
  },
  {
    label: "Men",
    href: "/men",
    children: [
      { label: "View All", href: "/men" },
      { label: "New Arrivals", href: "/men/new" },
      { label: "Outerwear", href: "/men/outerwear" },
      { label: "Jackets", href: "/men/jackets" },
      { label: "Shirts", href: "/men/shirts" },
      { label: "T-Shirts", href: "/men/t-shirts" },
      { label: "Denim", href: "/men/denim" },
      { label: "Knitwear", href: "/men/knitwear" },
      { label: "Trousers", href: "/men/trousers" },
    ],
  },
  {
    label: "Women",
    href: "/women",
    children: [
      { label: "View All", href: "/women" },
      { label: "New Arrivals", href: "/women/new" },
      { label: "Outerwear", href: "/women/outerwear" },
      { label: "Dresses", href: "/women/dresses" },
      { label: "Tops", href: "/women/tops" },
      { label: "Knitwear", href: "/women/knitwear" },
      { label: "Trousers", href: "/women/trousers" },
      { label: "Skirts", href: "/women/skirts" },
      { label: "Denim", href: "/women/denim" },
    ],
  },
  {
    label: "Unisex",
    href: "/unisex",
    children: [
      { label: "View All", href: "/unisex" },
      { label: "Outerwear", href: "/unisex/outerwear" },
      { label: "Knitwear", href: "/unisex/knitwear" },
    ],
  },
  {
    label: "Accessories",
    href: "/accessories",
    children: [
      { label: "View All", href: "/accessories" },
      { label: "Bags", href: "/accessories/bags" },
      { label: "Scarves", href: "/accessories/scarves" },
      { label: "Hats", href: "/accessories/hats" },
      { label: "Belts", href: "/accessories/belts" },
    ],
  },
  {
    label: "Archive",
    href: "/archive",
    children: [{ label: "View All", href: "/archive" }],
  },
  {
    label: "The World of Mavire",
    href: "/about",
    children: [
      { label: "Our Story", href: "/about" },
      { label: "Craftsmanship", href: "/craftsmanship" },
      { label: "Philosophy", href: "/philosophy" },
      { label: "Sustainability", href: "/sustainability" },
      { label: "Careers", href: "/careers" },
      { label: "Journal", href: "/journal" },
    ],
  },
];

type MegaNavProps = {
  isOpen: boolean;
  onClose: () => void;
  onOpenSearch?: () => void;
  onOpenWishlist?: () => void;
};

export default function MegaNav({
  isOpen,
  onClose,
  onOpenSearch,
  onOpenWishlist,
}: MegaNavProps) {
  const router = useRouter();
  const t = useTranslations("nav");
  const tc = useTranslations("common");
  const [activeL1, setActiveL1] = useState<number | null>(null);
  const [visible, setVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(isOpen);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  /* ─── Detect mobile ─── */
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  /* ─── Mobile sizing tokens ─── */
  const l1FontSize = isMobile ? 22 : 16;
  const l1LineHeight = isMobile ? 27 : 19;
  const l1Padding = isMobile ? "18px 12px 14px 28px" : "12px 8px 8px 24px";
  const l2FontSize = isMobile ? 18 : 14;
  const l2LineHeight = isMobile ? 22 : 17;
  const l2ItemPad = isMobile ? "13px 0" : "8px 0";
  const l2ListPad = isMobile ? "0 24px 12px 52px" : "0 24px 8px 48px";
  const botFontSize = isMobile ? 17 : 14;
  const botLineHeight = isMobile ? 21 : 17;
  const botPadding = isMobile ? "14px 28px" : "8px 24px";
  const botIconSize = isMobile ? 22 : 18;
  const headerHeight = isMobile ? 84 : 73;
  const chevronSize = isMobile ? 20 : 16;



  useEffect(() => {
    if (!isOpen) return;
    fetch("/api/account/me")
      .then((r) => setIsLoggedIn(r.ok))
      .catch(() => setIsLoggedIn(false));
  }, [isOpen]);

  async function handleLogout() {
    await fetch("/api/account/logout", { method: "POST" });
    onClose();
    router.push("/client/sign-up");
  }

  const BOTTOM_LINKS = isLoggedIn
    ? [
        { label: t("cart"), href: "/cart", icon: "bag" as const },
        { label: "Wishlist", href: "#wishlist", icon: "wishlist" as const },
        {
          label: t("account"),
          href: "/client/my-account",
          icon: "account" as const,
        },
        { label: t("search"), href: "#search", icon: "search" as const },
        { label: "My Orders", href: "/client/my-account" },
        { label: t("contact"), href: "/contact" },
      ]
    : [
        { label: t("cart"), href: "/cart", icon: "bag" as const },
        { label: "Wishlist", href: "#wishlist", icon: "wishlist" as const },
        {
          label: t("account"),
          href: "/client/sign-up",
          icon: "account" as const,
        },
        { label: t("search"), href: "#search", icon: "search" as const },
        { label: "Sign In", href: "/client/sign-up" },
        { label: t("contact"), href: "/contact" },
      ];

  /* Stagger the visibility so CSS transitions can play */
  useEffect(() => {
    if (isOpen) {
      setIsMounted(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setVisible(true));
      });
    } else {
      setVisible(false);
      setActiveL1(null);
      const timeoutId = window.setTimeout(() => setIsMounted(false), 350);
      return () => window.clearTimeout(timeoutId);
    }
  }, [isOpen]);

  const handleL1Click = useCallback((index: number) => {
    setActiveL1((prev) => (prev === index ? null : index));
  }, []);

  /* Lock body scroll when open */
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isMounted) return null;

  return (
    <>
      {/* ═══ Backdrop ═══ */}
      <Backdrop isOpen={visible} onClose={onClose} zIndex={300} />

      {/* ═══ Floating Panel ═══ */}
      <nav
        aria-label="Main navigation"
        style={{
          position: "fixed",
          top: 0,
          bottom: 0,
          left: 0,
          zIndex: 301,
          width: "clamp(320px, 24vw, 32.125rem)",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#fff",
          borderRadius: 0,
          boxShadow: "4px 0 24px rgba(0,0,0,0.08)",
          transform: visible ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.35s cubic-bezier(0.22, 0.61, 0.36, 1)",
          scrollbarWidth: "thin" as React.CSSProperties["scrollbarWidth"],
          scrollbarColor: "rgba(0,0,0,0.15) transparent",
          overflowY: "auto",
          overflowX: "hidden",
          boxSizing: "border-box",
          WebkitFontSmoothing: "antialiased",
        }}
        className="max-md:!left-0 max-md:!right-0 max-md:!top-0 max-md:!bottom-0 max-md:!w-full max-md:!shadow-none"
      >
        {/* ─── Header row: close button ─── */}
        <div style={{ margin: "0 24px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              height: headerHeight,
              padding: isMobile ? "24px 0 20px" : "20px 0 16px",
            }}
          >
            <CloseX onClick={onClose} isMobile={isMobile} />
          </div>
        </div>

        {/* ─── Divider ─── */}
        <div
          style={{ height: 1, background: "rgb(235, 235, 235)", margin: "0" }}
        />

        {/* ─── Primary nav items ─── */}
        <div
          style={{
            flex: "1 1 0%",
            overflowY: "auto",
            padding: isMobile ? "8px 0 56px" : "6px 0 48px",
          }}
        >
          <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
            {NAV_DATA.map((item, i) => (
              <li
                key={item.label}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  color: "rgb(51, 56, 60)",
                }}
              >
                {item.children ? (
                  <button
                    onClick={() => handleL1Click(i)}
                    style={{
                      display: "flex",
                      flex: "1 1 0%",
                      justifyContent: "space-between",
                      alignItems: "center",
                      textAlign: "left",
                      padding: l1Padding,
                      margin: 0,
                      border: 0,
                      background: "transparent",
                      color: "#000",
                      font: `400 ${l1FontSize}px/${l1LineHeight}px inherit`,
                      cursor: "pointer",
                      textDecoration: "none",
                      position: "relative",
                      transition: "color 0.25s ease",
                    }}
                  >
                    <span
                      style={{
                        paddingBottom: 4,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {item.label}
                    </span>
                    <ChevronIcon
                      size={chevronSize}
                      className={`flex-shrink-0 transition-transform duration-300 ${
                        activeL1 === i ? "rotate-90" : ""
                      }`}
                    />
                  </button>
                ) : (
                  <LocalizedLink
                    href={item.href}
                    onClick={onClose}
                    style={{
                      display: "flex",
                      flex: "1 1 0%",
                      alignItems: "center",
                      textAlign: "left",
                      padding: l1Padding,
                      margin: 0,
                      color:
                        item.href === "#"
                          ? "rgb(123, 132, 135)"
                          : "#000",
                      font: `400 ${l1FontSize}px/${l1LineHeight}px inherit`,
                      textDecoration: "none",
                      position: "relative",
                      cursor: item.href === "#" ? "default" : "pointer",
                      transition: "color 0.25s ease",
                    }}
                  >
                    <span style={{ paddingBottom: 4 }}>
                      {item.label}
                      {item.href === "#" && (
                        <span
                          style={{
                            marginLeft: 8,
                            fontSize: l2FontSize,
                            fontWeight: 400,
                            color: "rgb(180, 186, 189)",
                          }}
                        >
                          — Coming Soon
                        </span>
                      )}
                    </span>
                  </LocalizedLink>
                )}

                {/* L2 submenu */}
                {item.children && (
                  <div
                    style={{
                      overflow: "hidden",
                      maxHeight:
                        activeL1 === i
                          ? `${item.children.length * (isMobile ? 52 : 40) + 16}px`
                          : "0",
                      opacity: activeL1 === i ? 1 : 0,
                      transition:
                        "max-height 0.5s cubic-bezier(0.31, 0, 0.13, 1), opacity 0.4s cubic-bezier(0.31, 0, 0.13, 1)",
                    }}
                  >
                    <ul
                      style={{
                        margin: 0,
                        padding: l2ListPad,
                        listStyle: "none",
                      }}
                    >
                      {item.children.map((child, ci) => (
                        <li key={child.label}>
                          <LocalizedLink
                            href={child.href}
                            onClick={onClose}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              padding: l2ItemPad,
                              color: "rgb(80, 85, 89)",
                              font: `400 ${l2FontSize}px/${l2LineHeight}px inherit`,
                              textDecoration: "none",
                              opacity: activeL1 === i ? 1 : 0,
                              transform:
                                activeL1 === i
                                  ? "translateX(0)"
                                  : "translateX(-10px)",
                              transition: `transform 0.5s cubic-bezier(0.31, 0, 0.13, 1) ${ci * 0.03}s, opacity 0.5s cubic-bezier(0.31, 0, 0.13, 1) ${ci * 0.03}s, color 0.25s ease`,
                            }}
                          >
                            <span style={{ paddingBottom: 4 }}>
                              {child.label}
                            </span>
                          </LocalizedLink>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ul>

          {/* ─── Divider ─── */}
          <div
            style={{
              height: 1,
              background: "rgb(235, 235, 235)",
              margin: "8px 24px 0",
            }}
          />

          {/* ─── Bottom links ─── */}
          <div
            style={{
              padding: "8px 0",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {BOTTOM_LINKS.map((link, i) => (
              <LocalizedLink
                key={link.label}
                href={link.href}
                onClick={(e) => {
                  if (link.icon === "search" && onOpenSearch) {
                    e.preventDefault();
                    onClose();
                    onOpenSearch();
                  } else if (link.icon === "wishlist" && onOpenWishlist) {
                    e.preventDefault();
                    onClose();
                    onOpenWishlist();
                  } else {
                    onClose();
                  }
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: isMobile ? 16 : 12,
                  padding: botPadding,
                  color: "#000",
                  font: `400 ${botFontSize}px/${botLineHeight}px inherit`,
                  textDecoration: "none",
                  transition: "color 0.25s ease",
                }}
              >
                {link.icon === "bag" && (
                  <svg
                    width={botIconSize}
                    height={botIconSize}
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M18 7h-2.25V5.75C15.75 4.79 14.97 4 14 4H10c-.96 0-1.75.78-1.75 1.75V7H6c-1.1 0-2 .89-2 2v9c0 1.1.89 2 2 2h12c1.1 0 2-.89 2-2V9c0-1.1-.89-2-2-2Zm-8.25-1.25c0-.14.11-.25.25-.25h4.01c.14 0 .25.11.25.25V7H9.76V5.75ZM18.5 18.01c0 .27-.22.5-.5.5H6c-.27 0-.5-.22-.5-.5V9.01c0-.27.22-.5.5-.5h2.25v1.5h1.5v-1.5h4.5v1.5h1.5v-1.5H18c.27 0 .5.22.5.5v9Z"
                      fill="rgb(51, 56, 60)"
                    />
                  </svg>
                )}
                {link.icon === "wishlist" && (
                  <svg
                    width={botIconSize}
                    height={botIconSize}
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M13.641 5.627a4.44 4.44 0 0 1 3.348 0 4.4 4.4 0 0 1 1.422.935c.408.4.732.877.953 1.402a4.27 4.27 0 0 1 0 3.315 4.3 4.3 0 0 1-.953 1.402l-5.92 5.818a.7.7 0 0 1-.982 0l-5.92-5.818A4.3 4.3 0 0 1 4.3 9.62c0-1.15.465-2.25 1.289-3.06a4.42 4.42 0 0 1 3.096-1.26c1.159 0 2.272.452 3.096 1.26l.219.216.22-.215a4.4 4.4 0 0 1 1.421-.935M15.315 6.7a3 3 0 0 0-1.146.224 3 3 0 0 0-.968.636l-.71.698a.7.7 0 0 1-.982 0l-.71-.698a3.02 3.02 0 0 0-2.114-.86c-.796 0-1.556.311-2.115.86a2.9 2.9 0 0 0-.87 2.061c0 .771.311 1.513.87 2.061L12 17.02l5.43-5.337a2.9 2.9 0 0 0 .645-.947 2.87 2.87 0 0 0-.645-3.175 3 3 0 0 0-.969-.636 3 3 0 0 0-1.146-.224"
                      fill="rgb(51, 56, 60)"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
                {link.icon === "account" && (
                  <svg
                    width={botIconSize}
                    height={botIconSize}
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M12 14c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5Zm0-8.5c1.93 0 3.5 1.57 3.5 3.5S13.93 12.5 12 12.5 8.5 10.93 8.5 9 10.07 5.5 12 5.5ZM18.75 18v2h-1.5v-2c0-.69-.56-1.25-1.25-1.25H8c-.69 0-1.25.56-1.25 1.25v2h-1.5v-2c0-1.52 1.23-2.75 2.75-2.75h8c1.52 0 2.75 1.23 2.75 2.75Z"
                      fill="rgb(51, 56, 60)"
                    />
                  </svg>
                )}
                {link.icon === "search" && (
                  <svg
                    width={botIconSize}
                    height={botIconSize}
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M20 12c0-4.42-3.58-8-8-8s-8 3.58-8 8 3.58 8 8 8c1.94 0 3.72-.69 5.1-1.84L18.94 20 20 18.94l-1.84-1.84C19.31 15.72 20 13.94 20 12Zm-8 6.5c-3.58 0-6.5-2.92-6.5-6.5S8.42 5.5 12 5.5s6.5 2.92 6.5 6.5-2.92 6.5-6.5 6.5Z"
                      fill="rgb(51, 56, 60)"
                    />
                  </svg>
                )}
                <span style={{ paddingBottom: 4 }}>{link.label}</span>
              </LocalizedLink>
            ))}

            {/* ─── Sign Out (logged in only) ─── */}
            {isLoggedIn && (
              <button
                onClick={() => {
                  handleLogout();
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: isMobile ? 16 : 12,
                  padding: botPadding,
                  color: "#000",
                  font: `400 ${botFontSize}px/${botLineHeight}px inherit`,
                  textDecoration: "none",
                  border: 0,
                  background: "transparent",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "color 0.25s ease",
                }}
              >
                <svg
                  width={botIconSize}
                  height={botIconSize}
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2Zm-7 3.3c1.93 0 3.5 1.57 3.5 3.5S13.93 13.3 12 13.3 8.5 11.73 8.5 9.8 10.07 6.3 12 6.3ZM12 18c-2.03 0-4.43-.82-5.14-1.26a.47.47 0 0 1-.13-.71c.69-.98 2.76-1.53 5.27-1.53s4.58.55 5.27 1.53c.15.21.12.5-.13.71C16.43 17.18 14.03 18 12 18Z"
                    fill="rgb(51, 56, 60)"
                  />
                </svg>
                <span style={{ paddingBottom: 4 }}>Sign Out</span>
              </button>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}
