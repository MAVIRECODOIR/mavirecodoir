"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useWishlist } from "@/lib/wishlist";
import Backdrop from "@/components/ui/Backdrop";

export default function WishlistPanel() {
  const { items, isOpen, close, remove, count, isLoggedIn } = useWishlist();
  const [isMounted, setIsMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsMounted(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setIsVisible(true));
      });
      document.body.style.overflow = "hidden";
      return;
    }

    setIsVisible(false);
    const timeout = window.setTimeout(() => {
      setIsMounted(false);
    }, 350);
    document.body.style.overflow = "";

    return () => {
      window.clearTimeout(timeout);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isMounted) return null;

  return (
    <>
      <Backdrop isOpen={isOpen} onClose={close} zIndex={60} />

      {/* ─── Panel ─── */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Wishlist"
        className="fixed z-[61] bg-white flex flex-col"
        style={{
          /* Mobile: full screen from bottom. Desktop: right-side slide-in */
          top: 0,
          right: 0,
          bottom: 0,
          width: "100%",
          maxWidth: 432,
          transform: isVisible ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.35s cubic-bezier(0.22, 0.61, 0.36, 1)",
          boxShadow: "-4px 0 24px rgba(0,0,0,0.08)",
        }}
      >
        {/* ─── Header ─── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "24px 24px 0",
            marginBottom: 24,
          }}
        >
          <p
            style={{
              margin: 0,
              fontWeight: 600,
              fontSize: 14,
              lineHeight: "17px",
              letterSpacing: "normal",
            }}
          >
            Your wishlist
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <p
              style={{
                margin: 0,
                fontWeight: 400,
                fontSize: 12,
                lineHeight: "14px",
                color: "rgb(123, 132, 135)",
              }}
            >
              {count} {count === 1 ? "item" : "items"}
            </p>
            <button
              onClick={close}
              aria-label="Close wishlist"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 4,
                display: "flex",
                alignItems: "center",
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41Z"
                  fill="currentColor"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* ─── Items list ─── */}
        <div style={{ flex: 1, overflowY: "auto", padding: "0 24px" }}>
          {count === 0 ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                padding: "60px 20px",
              }}
            >
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                style={{ marginBottom: 16, opacity: 0.25 }}
              >
                <path
                  fill="currentColor"
                  fillRule="evenodd"
                  d="M13.641 5.627a4.44 4.44 0 0 1 3.348 0 4.4 4.4 0 0 1 1.422.935c.408.4.732.877.953 1.402a4.27 4.27 0 0 1 0 3.315 4.3 4.3 0 0 1-.953 1.402l-5.92 5.818a.7.7 0 0 1-.982 0l-5.92-5.818A4.3 4.3 0 0 1 4.3 9.62c0-1.15.465-2.25 1.289-3.06a4.42 4.42 0 0 1 3.096-1.26c1.159 0 2.272.452 3.096 1.26l.219.216.22-.215a4.4 4.4 0 0 1 1.421-.935"
                  clipRule="evenodd"
                />
              </svg>
              <p
                style={{
                  margin: 0,
                  fontWeight: 500,
                  fontSize: 16,
                  lineHeight: "19px",
                  maxWidth: 400,
                }}
              >
                Your wishlist is empty
              </p>
              <p
                style={{
                  margin: "12px 0 0",
                  fontWeight: 400,
                  fontSize: 14,
                  lineHeight: "20px",
                  color: "rgb(123, 132, 135)",
                  maxWidth: 400,
                }}
              >
                Browse our collections and add your favourite pieces.
              </p>
              <Link
                href="/"
                onClick={close}
                style={{
                  display: "inline-block",
                  marginTop: 24,
                  background: "#000",
                  color: "#fff",
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  padding: "14px 32px",
                  textDecoration: "none",
                }}
              >
                Explore Collections
              </Link>
            </div>
          ) : (
            <div
              style={{
                border: "1px solid rgb(229, 229, 229)",
                borderRadius: 4,
                backgroundColor: "#fff",
              }}
            >
              {items.map((item, idx) => (
                <div
                  key={item.productId}
                  style={{
                    display: "flex",
                    borderBottom:
                      idx < items.length - 1
                        ? "1px solid rgb(229, 229, 229)"
                        : "none",
                  }}
                >
                  {/* Image */}
                  <div
                    style={{
                      height: 180,
                      flexBasis: 130,
                      flexShrink: 0,
                      position: "relative",
                      minHeight: "100%",
                    }}
                  >
                    {item.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        alt={item.title}
                        fill
                        sizes="130px"
                        style={{ objectFit: "cover" }}
                        unoptimized
                      />
                    ) : (
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          background: "#f7f7f7",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" opacity={0.2}>
                          <path
                            fill="currentColor"
                            fillRule="evenodd"
                            d="M13.641 5.627a4.44 4.44 0 0 1 3.348 0 4.4 4.4 0 0 1 1.422.935c.408.4.732.877.953 1.402a4.27 4.27 0 0 1 0 3.315 4.3 4.3 0 0 1-.953 1.402l-5.92 5.818a.7.7 0 0 1-.982 0l-5.92-5.818A4.3 4.3 0 0 1 4.3 9.62c0-1.15.465-2.25 1.289-3.06a4.42 4.42 0 0 1 3.096-1.26c1.159 0 2.272.452 3.096 1.26l.219.216.22-.215a4.4 4.4 0 0 1 1.421-.935"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div
                    style={{
                      paddingLeft: 16,
                      paddingRight: 16,
                      flexGrow: 1,
                      minWidth: 0,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                    }}
                  >
                    <Link
                      href={`/pr/${item.handle}`}
                      onClick={close}
                      style={{
                        margin: 0,
                        fontWeight: 400,
                        fontSize: 14,
                        lineHeight: "20px",
                        color: "#000",
                        textDecoration: "none",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {item.title}
                    </Link>

                    {item.variant && (
                      <p
                        style={{
                          margin: "4px 0 0",
                          fontWeight: 400,
                          fontSize: 14,
                          lineHeight: "20px",
                          color: "rgb(123, 132, 135)",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          maxWidth: 140,
                        }}
                      >
                        {item.variant}
                      </p>
                    )}

                    <div
                      style={{
                        display: "flex",
                        marginTop: 16,
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <button
                        onClick={() => remove(item.productId)}
                        aria-label={`Remove ${item.title} from wishlist`}
                        style={{
                          border: "none",
                          background: "none",
                          cursor: "pointer",
                          color: "rgb(93, 103, 108)",
                          fontSize: 14,
                          fontWeight: 400,
                          padding: "0 0 2px",
                          position: "relative",
                          textDecoration: "none",
                          backgroundImage:
                            "linear-gradient(rgb(93, 103, 108) 0px, rgb(93, 103, 108) 0px)",
                          backgroundRepeat: "no-repeat",
                          backgroundPosition: "0% 100%",
                          backgroundSize: "100% 1px",
                          lineHeight: "normal",
                          height: 18,
                        }}
                      >
                        Remove
                      </button>
                      <p
                        style={{
                          margin: "2px 0 0",
                          fontWeight: 500,
                          fontSize: 14,
                          lineHeight: "17px",
                        }}
                      >
                        {item.price}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ─── Login prompt (guest only) ─── */}
          {!isLoggedIn && (
            <div
              style={{
                padding: "28px 20px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontWeight: 500,
                  fontSize: 16,
                  lineHeight: "19px",
                  maxWidth: 400,
                }}
              >
                Log in to save your wishlist
              </p>
              <p
                style={{
                  margin: "16px 0 0",
                  fontWeight: 400,
                  fontSize: 14,
                  lineHeight: "20px",
                  color: "rgb(123, 132, 135)",
                  maxWidth: 400,
                }}
              >
                Create a wishlist, access it any time from any device.
              </p>
              <Link
                href="/client/sign-up"
                onClick={close}
                style={{
                  marginTop: 16,
                  fontWeight: 400,
                  fontSize: 14,
                  color: "rgb(51, 56, 60)",
                  textDecoration: "none",
                  backgroundImage:
                    "linear-gradient(rgb(51, 56, 60) 0px, rgb(51, 56, 60) 0px)",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "0% 100%",
                  backgroundSize: "100% 1px",
                  paddingBottom: 2,
                  height: 18,
                  lineHeight: "normal",
                }}
              >
                Log in or create an account
              </Link>
            </div>
          )}
        </div>

        {/* ─── Footer ─── */}
        <div
          style={{
            borderTop: "1px solid rgb(229, 229, 229)",
            paddingTop: 20,
            paddingBottom: 20,
            textAlign: "center",
            color: "rgb(123, 132, 135)",
          }}
        >
          <p style={{ margin: 0, fontWeight: 500, fontSize: 14, lineHeight: "17px" }}>
            <span>Search for </span>
            <Link
              href="/new-arrivals"
              onClick={close}
              style={{
                color: "rgb(123, 132, 135)",
                textDecoration: "underline",
                fontWeight: 500,
                fontSize: 14,
              }}
            >
              New Arrivals
            </Link>
            <span> products</span>
          </p>
        </div>
      </div>
    </>
  );
}
