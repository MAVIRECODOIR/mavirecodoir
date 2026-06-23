"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import MegaNav from "./MegaNav";
import Backdrop from "../ui/Backdrop";
import { useWishlist } from "@/lib/wishlist";
import { useCart } from "@/lib/medusa/cart-context";

/* ─── SVG icon components matching MAVIRE CODIR icon paths ─── */

function BagIcon({ color }: { color: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M18 7h-2.25V5.75C15.75 4.79 14.97 4 14 4H10c-.96 0-1.75.78-1.75 1.75V7H6c-1.1 0-2 .89-2 2v9c0 1.1.89 2 2 2h12c1.1 0 2-.89 2-2V9c0-1.1-.89-2-2-2Zm-8.25-1.25c0-.14.11-.25.25-.25h4.01c.14 0 .25.11.25.25V7H9.76V5.75ZM18.5 18.01c0 .27-.22.5-.5.5H6c-.27 0-.5-.22-.5-.5V9.01c0-.27.22-.5.5-.5h2.25v1.5h1.5v-1.5h4.5v1.5h1.5v-1.5H18c.27 0 .5.22.5.5v9Z"
        fill={color}
      />
    </svg>
  );
}

function AccountIcon({ color }: { color: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 14c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5Zm0-8.5c1.93 0 3.5 1.57 3.5 3.5S13.93 12.5 12 12.5 8.5 10.93 8.5 9 10.07 5.5 12 5.5ZM18.75 18v2h-1.5v-2c0-.69-.56-1.25-1.25-1.25H8c-.69 0-1.25.56-1.25 1.25v2h-1.5v-2c0-1.52 1.23-2.75 2.75-2.75h8c1.52 0 2.75 1.23 2.75 2.75Z"
        fill={color}
      />
    </svg>
  );
}

function SearchIcon({ color }: { color: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M20 12c0-4.42-3.58-8-8-8s-8 3.58-8 8 3.58 8 8 8c1.94 0 3.72-.69 5.1-1.84L18.94 20 20 18.94l-1.84-1.84C19.31 15.72 20 13.94 20 12Zm-8 6.5c-3.58 0-6.5-2.92-6.5-6.5S8.42 5.5 12 5.5s6.5 2.92 6.5 6.5-2.92 6.5-6.5 6.5Z"
        fill={color}
      />
    </svg>
  );
}

function MenuIcon({ color }: { color: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M20 6.5H4V5h16v1.5ZM20 11.25H4v1.5h16v-1.5ZM20 17.5H4V19h16v-1.5Z"
        fill={color}
      />
    </svg>
  );
}

function ContactPlusIcon({ color }: { color: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M12 8.75H8.75V12h-1.5V8.75H4v-1.5h3.25V4h1.5v3.25H12v1.5Z"
        fill={color}
      />
    </svg>
  );
}

function HeartIcon({ color, filled }: { color: string; filled?: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      {filled ? (
        <path
          d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
          fill={color}
        />
      ) : (
        <path
          fill={color}
          fillRule="evenodd"
          d="M13.641 5.627a4.44 4.44 0 0 1 3.348 0 4.4 4.4 0 0 1 1.422.935c.408.4.732.877.953 1.402a4.27 4.27 0 0 1 0 3.315 4.3 4.3 0 0 1-.953 1.402l-5.92 5.818a.7.7 0 0 1-.982 0l-5.92-5.818A4.3 4.3 0 0 1 4.3 9.62c0-1.15.465-2.25 1.289-3.06a4.42 4.42 0 0 1 3.096-1.26c1.159 0 2.272.452 3.096 1.26l.219.216.22-.215a4.4 4.4 0 0 1 1.421-.935M15.315 6.7a3 3 0 0 0-1.146.224 3 3 0 0 0-.968.636l-.71.698a.7.7 0 0 1-.982 0l-.71-.698a3.02 3.02 0 0 0-2.114-.86c-.796 0-1.556.311-2.115.86a2.9 2.9 0 0 0-.87 2.061c0 .771.311 1.513.87 2.061L12 17.02l5.43-5.337a2.9 2.9 0 0 0 .645-.947 2.87 2.87 0 0 0-.645-3.175 3 3 0 0 0-.969-.636 3 3 0 0 0-1.146-.224"
          clipRule="evenodd"
        />
      )}
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41Z" fill="currentColor" />
    </svg>
  );
}

export default function Header() {
  const pathname = usePathname() ?? "/";
  const isHomePage = pathname === "/";
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    fetch("/api/account/me")
      .then((r) => setIsLoggedIn(r.ok))
      .catch(() => setIsLoggedIn(false));
  }, []);

  if (pathname === "/cart" || pathname === "/checkout") {
    return null;
  }

  const wishlist = useWishlist();
  const { cartId, openCart } = useCart();
  const [cartItemCount, setCartItemCount] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSearchMounted, setIsSearchMounted] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);


  const handleScroll = useCallback(() => {
    setScrollY(window.scrollY);
  }, []);

  useEffect(() => {
    if (!isHomePage) return; // no scroll tracking on inner pages
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll, isHomePage]);

  useEffect(() => {
    if (isSearchVisible && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchVisible]);

  useEffect(() => {
    if (isSearchOpen) {
      setIsSearchMounted(true);
      requestAnimationFrame(() => setIsSearchVisible(true));
      return;
    }

    setIsSearchVisible(false);
    if (!isSearchMounted) return;

    const timeoutId = window.setTimeout(() => {
      setIsSearchMounted(false);
    }, 320);

    return () => window.clearTimeout(timeoutId);
  }, [isSearchOpen, isSearchMounted]);

  const openSearch = () => setIsSearchOpen(true);
  const closeSearch = () => setIsSearchOpen(false);

  useEffect(() => {
    if (!cartId) { setCartItemCount(0); return }
    import("../../lib/medusa/cart").then(({ getCart }) =>
      getCart(cartId).then((cart) => {
        if (cart) setCartItemCount(cart.items?.length || 0)
      }).catch(() => setCartItemCount(0))
    ).catch(() => {})
  }, [cartId]);

  /* ─── Scroll-driven state (binary trigger, CSS transitions handle smoothness) ─── */
  // On inner pages, always show compact header (no animation)
  const collapsed = isHomePage ? scrollY > 2 : true;

  // Header bar height (matched to MAVIRE CODIR proportions)
  const headerBarHeight = 80;

  // Icon color: white over hero, black in header
  const iconColor = collapsed ? "#000000" : "#FFFFFF";

  // Logo invert: 1 = white (over hero), 0 = black (in header)
  const logoInvert = collapsed ? 0 : 1;

  // Logo sizing tuned to MAVIRE CODIR proportions
  const expandedLogoWidth = "86vw";
  const expandedLogoMaxWidth = "1312px";
  const collapsedLogoWidth = "200px";
  const headerSideWidth = 220;

  // Transition timing — slow enough to see the animation clearly
  const dur = isHomePage ? "0.8s" : "0s";
  const ease = "ease";

  /* ─── Shared icon list (reused in both modes) ─── */
  const iconList = (
    <ul className="flex items-center gap-0 md:gap-0.5">
      <li className="hidden md:flex">
        <button
          onClick={openCart}
          aria-label="my shopping bag"
          aria-haspopup="dialog"
          className="mavire-btn-motion flex items-center justify-center w-10 h-10 relative"
        >
          <BagIcon color={iconColor} />
          {cartItemCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-[15px] h-[15px] rounded-full bg-black text-white text-[9px] font-semibold flex items-center justify-center leading-none">
              {cartItemCount}
            </span>
          )}
        </button>
      </li>
      <li className="hidden md:flex">
        <button
          onClick={() => wishlist.open()}
          aria-label="my wishlist"
          aria-haspopup="dialog"
          className="mavire-btn-motion flex items-center justify-center w-10 h-10 relative"
        >
          <HeartIcon color={iconColor} filled={wishlist.count > 0} />
          {wishlist.count > 0 && (
            <span
              style={{
                position: "absolute",
                top: 4,
                right: 2,
                minWidth: 16,
                height: 16,
                borderRadius: "50%",
                background: "#000",
                color: "#fff",
                fontSize: 9,
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                lineHeight: 1,
              }}
            >
              {wishlist.count}
            </span>
          )}
        </button>
      </li>
      <li className="hidden md:flex">
        <Link
          href={isLoggedIn ? "/client/my-account" : "/client/sign-up"}
          aria-label="my account"
          className="mavire-btn-motion flex items-center justify-center w-10 h-10"
        >
          <AccountIcon color={iconColor} />
        </Link>
      </li>
      <li className="hidden md:flex">
        <button
          onClick={openSearch}
          aria-label="search"
          aria-haspopup="dialog"
          className="mavire-btn-motion flex items-center justify-center w-10 h-10"
        >
          <SearchIcon color={iconColor} />
        </button>
      </li>
      {/* Mobile: icons visible only before scroll (over hero) */}
      <li className={`${collapsed ? "hidden" : "flex"} md:hidden`}>
        <button
          onClick={openSearch}
          aria-label="search"
          className="mavire-btn-motion flex items-center justify-center w-9 h-9"
        >
          <SearchIcon color={iconColor} />
        </button>
      </li>
      <li className={`${collapsed ? "hidden" : "flex"} md:hidden`}>
        <button
          onClick={openCart}
          aria-label="my shopping bag"
          aria-haspopup="dialog"
          className="mavire-btn-motion flex items-center justify-center w-9 h-9 relative"
        >
          <BagIcon color={iconColor} />
          {cartItemCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-[15px] h-[15px] rounded-full bg-black text-white text-[9px] font-semibold flex items-center justify-center leading-none">
              {cartItemCount}
            </span>
          )}
        </button>
      </li>
      <li className={`${collapsed ? "hidden" : "flex"} md:hidden`}>
        <button
          onClick={() => wishlist.open()}
          aria-label="my wishlist"
          className="mavire-btn-motion flex items-center justify-center w-9 h-9 relative"
        >
          <HeartIcon color={iconColor} filled={wishlist.count > 0} />
        </button>
      </li>
      <li className={`${collapsed ? "hidden" : "flex"} md:hidden`}>
        <Link
          href={isLoggedIn ? "/client/my-account" : "/client/sign-up"}
          aria-label="my account"
          className="mavire-btn-motion flex items-center justify-center w-9 h-9"
        >
          <AccountIcon color={iconColor} />
        </Link>
      </li>
      <li>
        <button
          onClick={() => setIsNavOpen(true)}
          aria-label="menu toggle"
          aria-haspopup="dialog"
          className="mavire-btn-motion flex items-center gap-1.5 h-10 pl-1 pr-0"
        >
          <MenuIcon color={iconColor} />
          <span
            className="hidden md:inline"
            style={{
              fontSize: "11px",
              fontWeight: 500,
              letterSpacing: "0.08em",
              color: iconColor,
            }}
          >
            MENU
          </span>
        </button>
      </li>
    </ul>
  );

  /* ─── Contact Us button (reused) ─── */
  const contactBtn = (
    <button
      className="mavire-btn-motion flex items-center gap-1 h-full"
      aria-label="Contact Us"
    >
      <ContactPlusIcon color="#000" />
      <span
        style={{
          fontSize: "11px",
          fontWeight: 400,
          letterSpacing: "0.04em",
          color: "#000",
        }}
      >
        Contact Us
      </span>
    </button>
  );

  /* ═════════════════════════════════════════════════════════════════ */
  /* INNER PAGES — static compact header, no animation                  */
  /* ═════════════════════════════════════════════════════════════════ */
  if (!isHomePage) {
    return (
      <>
        <header
          className="sticky top-0 z-50 bg-white"
          style={{
            height: headerBarHeight,
            borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
          }}
        >
          <div
            className="relative flex items-center justify-between h-full"
            style={{ padding: "0 20px" }}
          >
            {/* Left: Contact Us (hidden on mobile) */}
            <div className="hidden md:flex items-center h-full" style={{ width: headerSideWidth }}>
              {contactBtn}
            </div>

            {/* Center: compact logo */}
            <Link
              href="/"
              aria-label="MAVIRE CODOIR - go to homepage"
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{ width: collapsedLogoWidth }}
            >
              <Image
                src="https://pub-cb269c46bd284333bcafb48988f70133.r2.dev/brand/logos/png/1771394628214-zkowej-Mavire%20Codoir%20-%20LOGO.webp"
                alt="MAVIRE CODOIR"
                width={1390}
                height={213}
                priority
                unoptimized
                className="transition-[filter] duration-300"
                style={{
                  filter: `brightness(0) invert(${logoInvert})`,
                  objectFit: "contain",
                }}
              />
            </Link>

            {/* Right: icons */}
            <div className="flex items-center justify-end" style={{ width: headerSideWidth }}>
              {iconList}
            </div>
          </div>
        </header>

        {/* Dior-style Subcategory Navigation — sticky under header on collection routes */}
        {(() => {
          // Define subcategory links directly from collection handles (matches created collections)
          const MEN_COLLECTIONS = [
            { label: "Outerwear", handle: "men-outerwear" },
            { label: "Jackets", handle: "men-jackets" },
            { label: "Shirts", handle: "men-shirts" },
            { label: "T-Shirts", handle: "men-t-shirts" },
            { label: "Denim", handle: "men-denim" },
            { label: "Knitwear", handle: "men-knitwear" },
            { label: "Trousers", handle: "men-trousers" },
          ];

          const WOMEN_COLLECTIONS = [
            { label: "Outerwear", handle: "women-outerwear" },
            { label: "Dresses", handle: "women-dresses" },
            { label: "Tops", handle: "women-tops" },
            { label: "Knitwear", handle: "women-knitwear" },
            { label: "Trousers", handle: "women-trousers" },
            { label: "Skirts", handle: "women-skirts" },
            { label: "Denim", handle: "women-denim" },
          ];

          const UNISEX_COLLECTIONS = [
            { label: "Outerwear", handle: "unisex-outerwear" },
            { label: "Knitwear", handle: "unisex-knitwear" },
          ];

          const ACCESSORIES_COLLECTIONS = [
            { label: "Bags", handle: "accessories/bags", path: "/accessories/bags" },
            { label: "Scarves", handle: "accessories/scarves", path: "/accessories/scarves" },
            { label: "Hats", handle: "accessories/hats", path: "/accessories/hats" },
            { label: "Belts", handle: "accessories/belts", path: "/accessories/belts" },
          ];

          const ARCHIVE_COLLECTIONS: { label: string; handle: string; path?: string }[] = [];

          const buildLinks = (base: string, items: { label: string; handle: string; path?: string }[]) => {
            return [
              { label: "View all", href: `/${base}` },
              ...items.map((item) => {
                // Derive friendly path from handle unless an explicit path is provided
                const derivedPath = item.handle.startsWith(`${base}-`)
                  ? `/${base}/${item.handle.replace(`${base}-`, "")}`
                  : `/${item.handle}`;
                return { label: item.label, href: item.path ?? derivedPath };
              }),
            ];
          };

          const menLinks = buildLinks("men", MEN_COLLECTIONS);
          const womenLinks = buildLinks("women", WOMEN_COLLECTIONS);
          const unisexLinks = buildLinks("unisex", UNISEX_COLLECTIONS);
          const accessoriesLinks = buildLinks("accessories", ACCESSORIES_COLLECTIONS);
          const archiveLinks = buildLinks("archive", ARCHIVE_COLLECTIONS);

          let navLinks: { label: string; href: string }[] = [];
          let navTitle = "";

          if (pathname.startsWith("/men")) {
            navLinks = menLinks;
            navTitle = "Men";
          } else if (pathname.startsWith("/women")) {
            navLinks = womenLinks;
            navTitle = "Women";
          } else if (pathname.startsWith("/unisex")) {
            navLinks = unisexLinks;
            navTitle = "Unisex";
          } else if (pathname.startsWith("/accessories")) {
            navLinks = accessoriesLinks;
            navTitle = "Accessories";
          } else if (pathname.startsWith("/archive")) {
            navLinks = archiveLinks;
            navTitle = "Archive";
          }

          if (navLinks.length === 0) return null;

          return (
            <nav
              role="navigation"
              aria-label="submenu"
              className="sticky z-40 bg-white"
              style={{
                top: headerBarHeight,
                borderBottom: "1px solid rgb(217, 220, 224)",
                display: "flex",
                width: "100%",
                minHeight: 50,
                paddingLeft: 20,
              }}
            >
              <h2
                style={{
                  alignSelf: "center",
                  fontSize: 20,
                  letterSpacing: "normal",
                  lineHeight: "20px",
                  margin: "0 27px 0 0",
                  fontWeight: 700,
                  flexShrink: 0,
                  textTransform: "uppercase",
                }}
              >
                {navTitle}
              </h2>
              <div
                style={{
                  overflow: "hidden",
                  paddingRight: 20,
                  position: "relative",
                }}
              >
                <ul
                  style={{
                    listStyle: "none",
                    margin: 0,
                    padding: 0,
                    display: "flex",
                    fontSize: 12,
                    fontWeight: 400,
                    height: 49,
                    lineHeight: "18px",
                    overflowX: "auto",
                    position: "relative",
                    scrollbarWidth: "none",
                  }}
                >
                  {navLinks.map((item, idx, arr) => {
                    // Check if this link is active (exact match or starts with for subcollections)
                    const isActive = pathname === item.href || 
                      (item.href !== navLinks[0].href && pathname.startsWith(item.href));
                    
                    return (
                      <li
                        key={item.label}
                        style={{
                          alignItems: idx === 0 ? "baseline" : "center",
                          fontSize: 12,
                          fontWeight: 500,
                          lineHeight: "16px",
                          transitionDuration: "0.5s",
                          transitionProperty: "color, background-color, border-color, opacity",
                          transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
                          display: "flex",
                          marginRight: idx === arr.length - 1 ? 0 : 20,
                        }}
                      >
                        <Link
                          href={item.href}
                          style={{
                            paddingBottom: 15.5,
                            paddingTop: 15.5,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            textDecoration: "none",
                            color: "inherit",
                            borderBottom: isActive ? "2px solid #33383c" : "2px solid transparent",
                          }}
                        >
                          {item.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </nav>
          );
        })()}

        {/* Search Overlay */}
        {isSearchOpen && (
          <div className="fixed inset-0 z-[60] bg-white">
            <div className="flex items-center h-14 px-4 border-b border-gray-200">
              <SearchIcon color="#999" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search"
                className="flex-1 ml-3 text-base font-medium tracking-wider outline-none bg-transparent"
              />
              <button
                onClick={() => setIsSearchOpen(false)}
                className="mavire-btn-motion p-2"
                aria-label="Close search"
              >
                <CloseIcon />
              </button>
            </div>
          </div>
        )}

        <MegaNav isOpen={isNavOpen} onClose={() => setIsNavOpen(false)} onOpenSearch={openSearch} onOpenWishlist={() => wishlist.open()} />
      </>
    );
  }

  /* ═════════════════════════════════════════════════════════════════ */
  /* HOMEPAGE — scroll-driven animated header                          */
  /* ═════════════════════════════════════════════════════════════════ */
  return (
    <>
      {/* ═══ SINGLE LOGO (shrinks from hero center into header bar) ═══ */}
      <div
        className="fixed z-[45] left-0 right-0 flex justify-center pointer-events-none"
        style={{
          left: collapsed ? "20px" : "0px",
          right: collapsed ? "20px" : "0px",
          top: collapsed ? "calc(50vh + 1px)" : "50vh",
          transform: collapsed
            ? `translate3d(0px, calc(-50vh + ${headerBarHeight / 2}px - 50%), 0px)`
            : "translate3d(0px, -50%, 0px)",
          transition: `left ${dur} ${ease}, right ${dur} ${ease}, transform ${dur} ${ease}`,
          willChange: "transform",
        }}
      >
        <Link
          href="/"
          aria-label="MAVIRE CODOIR - go to homepage"
          className="pointer-events-auto block"
          style={{
            width: collapsed ? collapsedLogoWidth : expandedLogoWidth,
            maxWidth: collapsed ? "none" : expandedLogoMaxWidth,
            minWidth: collapsedLogoWidth,
            transition: `width ${dur} ${ease}`,
          }}
        >
          <Image
            src="https://pub-cb269c46bd284333bcafb48988f70133.r2.dev/brand/logos/png/1771394628214-zkowej-Mavire%20Codoir%20-%20LOGO.webp"
            alt="MAVIRE CODOIR"
            width={1390}
            height={213}
            priority
            unoptimized
            className="transition-[filter] duration-300"
            style={{
              filter: `invert(${logoInvert})`,
              objectFit: "contain",
            }}
          />
        </Link>
      </div>

      {/* ═══ FLOATING ICONS (top-right, always visible) ═══ */}
      <div
        className="fixed top-0 right-0 z-50 flex items-center"
        style={{
          top: collapsed ? "0px" : "8px",
          height: `${headerBarHeight}px`,
          width: `${headerSideWidth}px`,
          right: "20px",
          justifyContent: "flex-end",
          pointerEvents: "auto",
          transition: `top ${dur} ${ease}`,
        }}
      >
        {iconList}
      </div>

      {/* ═══ HEADER BAR BACKGROUND (fades in on scroll) ═══ */}
      <header
        className="fixed top-0 left-0 right-0 z-[44]"
        style={{
          height: headerBarHeight,
          backgroundColor: collapsed ? "rgba(255, 255, 255, 1)" : "rgba(255, 255, 255, 0)",
          borderBottom: collapsed ? "1px solid rgba(0, 0, 0, 0.1)" : "1px solid transparent",
          pointerEvents: collapsed ? "auto" : "none",
          transition: `background-color ${dur} ${ease}, border-bottom ${dur} ${ease}`,
        }}
      >
        <div
          className="relative flex items-center justify-between h-full"
          style={{ padding: "0 20px" }}
        >
          {/* Left: + Contact Us (hidden on mobile) */}
          <div className="hidden md:flex items-center h-full" style={{ width: headerSideWidth }}>
            <button
              className="mavire-btn-motion flex items-center gap-1 h-full"
              aria-label="Contact Us"
              style={{
                opacity: collapsed ? 1 : 0,
                pointerEvents: collapsed ? "auto" : "none",
                transition: `opacity ${dur} ${ease}`,
              }}
            >
              <ContactPlusIcon color="#000" />
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 400,
                  letterSpacing: "0.04em",
                  color: "#000",
                }}
              >
                Contact Us
              </span>
            </button>
          </div>

          {/* Center is occupied by the single logo element above */}

          {/* Right: spacer to balance layout (icons are in floating layer) */}
          <div style={{ width: headerSideWidth }} />
        </div>
      </header>


      {/* ═══ Search Overlay ═══ */}
      {isSearchMounted && (
        <>
          <Backdrop isOpen={isSearchVisible} onClose={closeSearch} zIndex={59} />
          <div
            className={`fixed inset-0 z-[60] flex items-start justify-center p-2 sm:p-4 transition-opacity duration-300 ease-out ${
              isSearchVisible ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            <div
              className={`w-full max-w-5xl rounded-sm border border-gray-200 bg-white shadow-[0_18px_42px_rgba(0,0,0,0.25)] transition-all duration-300 ease-out ${
                isSearchVisible ? "translate-y-0" : "-translate-y-4"
              }`}
            >
              <div className="flex items-center h-14 px-4 border-b border-gray-200">
                <SearchIcon color="#999" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search"
                  className="flex-1 ml-3 text-base font-medium tracking-wider outline-none bg-transparent"
                />
                <button
                  onClick={closeSearch}
                  className="mavire-btn-motion p-2"
                  aria-label="Close search"
                >
                  <CloseIcon />
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ═══ Mega Navigation ═══ */}
      <MegaNav isOpen={isNavOpen} onClose={() => setIsNavOpen(false)} onOpenSearch={openSearch} onOpenWishlist={() => wishlist.open()} />
    </>
  );
}
