"use client";

import { useState } from "react";
import Link from "next/link";
import { useEffect } from "react";

type SortOption = {
  label: string;
  value: string;
};

type FilterOption = {
  label: string;
  value: string;
};

type FilterGroup = {
  name: string;
  options: FilterOption[];
};

type Props = {
  options: SortOption[];
  activeValue: string;
  productCount?: number;
  filters?: FilterGroup[];
};

export default function FilterSortDrawer({ options, activeValue, productCount, filters = [] }: Props) {
  const [open, setOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});

  // allow smooth close animation
  useEffect(() => {
    if (!isClosing) return;
    const t = setTimeout(() => setIsClosing(false), 200);
    return () => clearTimeout(t);
  }, [isClosing]);

  // Initialize filter state
  useEffect(() => {
    const initial: Record<string, string[]> = {};
    filters.forEach((group) => {
      initial[group.name] = [];
    });
    setSelectedFilters(initial);
  }, [filters]);

  const showDrawer = () => {
    setOpen(true);
  };

  const hideDrawer = () => {
    setIsClosing(true);
    setTimeout(() => setOpen(false), 180);
  };
  const activeLabel = options.find((o) => o.value === activeValue)?.label || options[0]?.label || "";

  return (
    <>
      {/* Trigger button */}
      <div
        className="MuiBox-root"
        style={{
          position: "fixed",
          bottom: "24px",
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          zIndex: 11,
          pointerEvents: "none",
        }}
      >
        <button
          onClick={showDrawer}
          className="MuiButtonBase-root MuiButton-root MuiButton-contained MuiButton-containedSecondary MuiButton-sizeMedium MuiButton-containedSizeMedium MuiButton-colorSecondary MuiButton-disableElevation"
          tabIndex={0}
          role="button"
          aria-haspopup="dialog"
          style={{
            pointerEvents: "auto",
            minWidth: "56px",
            height: "48px",
            padding: "6px 16px",
            borderRadius: "6px",
            backgroundColor: "#fff",
            color: "rgba(0, 0, 0, 0.87)",
            boxShadow: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            border: "1px solid #e5e5e5",
            fontFamily: "Hellix, ABCDiorIcons, arial, sans-serif",
            cursor: "pointer",
          }}
        >
          <span style={{ display: "flex" }}>
            <svg
              className="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium DS-Icon"
              focusable="false"
              aria-hidden="true"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
            >
              <path
                fill="currentColor"
                fillRule="evenodd"
                d="M8.2 6a.7.7 0 0 0-1.4 0v.3H5.497a.7.7 0 0 0 0 1.4H6.8V8a.7.7 0 1 0 1.4 0v-.3h9.297a.7.7 0 1 0 0-1.4H8.2zm-2.703 5.3a.7.7 0 0 0 0 1.4H14.8v.3a.7.7 0 1 0 1.4 0v-.3h1.297a.7.7 0 1 0 0-1.4H16.2V11a.7.7 0 1 0-1.4 0v.3H5.497zM5.5 16.3a.7.7 0 0 0 0 1.4H10.8v.3a.7.7 0 1 0 1.4 0v-.3h5.297a.7.7 0 1 0 0-1.4H12.2V16a.7.7 0 1 0-1.4 0v.3H5.5z"
                clipRule="evenodd"
              ></path>
            </svg>
          </span>
          <span className="MuiBox-root" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <p
              className="MuiTypography-root MuiTypography-body1"
              style={{ margin: 0, fontSize: "14px", lineHeight: "17px", fontWeight: 500, textDecoration: "none" }}
            >
              Filter & Sort
            </p>
          </span>
        </button>
      </div>

      {/* Drawer overlay */}
      {(open || isClosing) && (
        <>
          <div
            onClick={hideDrawer}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.25)",
              backdropFilter: "blur(6px)",
              WebkitBackdropFilter: "blur(6px)",
              zIndex: 1299,
              opacity: open && !isClosing ? 1 : 0,
              transition: "opacity 320ms cubic-bezier(0.31, 0, 0.13, 1)",
            }}
          />
          <div
            role="dialog"
            aria-modal="true"
            className="MuiPaper-root MuiPaper-elevation MuiPaper-elevation16 MuiDrawer-paper MuiDrawer-paperAnchorRight"
            style={{
              position: "fixed",
              top: "16px",
              right: "16px",
              bottom: "16px",
              width: "clamp(320px, 24vw, 514px)",
              background: "#fff",
              zIndex: 1300,
              borderRadius: "8px",
              boxShadow: "0 16px 40px rgba(0,0,0,0.16)",
              display: "flex",
              flexDirection: "column",
              transform: open && !isClosing ? "translateX(0)" : "translateX(36px)",
              opacity: open && !isClosing ? 1 : 0,
              transition: "opacity 420ms cubic-bezier(0.31, 0, 0.13, 1) 80ms, transform 620ms cubic-bezier(0.31, 0, 0.13, 1)",
              overflow: "hidden",
            }}
          >
          <div className="DS-ModalHeader MuiBox-root" style={{ padding: "16px", borderBottom: "1px solid #e0e0e0" }}>
            <div className="MuiBox-root" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div className="MuiBox-root">
                <p
                  className="MuiTypography-root MuiTypography-label-m-medium DS-Typography"
                  role="heading"
                  aria-level={2}
                  style={{ margin: 0, textDecoration: "none" }}
                >
                  Filter & Sort
                </p>
              </div>
              <button
                onClick={hideDrawer}
                className="MuiButtonBase-root MuiIconButton-root MuiIconButton-sizeSmall DS-IconButton-m"
                type="button"
                aria-label="Close dialog"
                style={{ border: "none", background: "transparent", cursor: "pointer", padding: "4px", display: "flex" }}
              >
                <svg
                  className="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium DS-Icon"
                  focusable="false"
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  style={{ height: 24, width: 24 }}
                >
                  <path
                    fill="currentColor"
                    fillRule="evenodd"
                    d="M7.495 6.505a.7.7 0 0 0-.99.99L11.01 12l-4.505 4.505a.7.7 0 1 0 .99.99L12 12.99l4.404 4.404a.7.7 0 0 0 .99-.99L12.99 12l4.405-4.405a.7.7 0 1 0-.99-.99L12 11.01z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </button>
            </div>
          </div>

          <div className="MuiBox-root" style={{ flex: 1, overflowY: "auto", padding: "0 0 16px" }}>
            <ul className="MuiBox-root" style={{ listStyle: "none", margin: 0, padding: 0 }}>
              {/* Sort by */}
              <li className="MuiBox-root" style={{ borderBottom: "1px solid #e0e0e0" }}>
                <button
                  className="MuiBox-root"
                  tabIndex={0}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                    padding: "16px",
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                  }}
                >
                  <span className="MuiBox-root">
                    <p className="MuiTypography-root MuiTypography-label-m-bold DS-Typography" style={{ margin: 0 }}>Sort by</p>
                  </span>
                  <span className="MuiBox-root" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <p className="MuiTypography-root MuiTypography-label-s-regular DS-Typography" style={{ margin: 0 }}>{activeLabel}</p>
                    <svg
                      className="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium DS-Icon"
                      focusable="false"
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="none"
                    >
                      <path
                        fill="currentColor"
                        fillRule="evenodd"
                        d="M8.869 5.869a.7.7 0 0 1 .99 0l5.636 5.636a.7.7 0 0 1 0 .99l-5.636 5.636a.7.7 0 1 1-.99-.99L14.01 12 8.869 6.859a.7.7 0 0 1 0-.99"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  </span>
                </button>
              </li>

              {/* Dynamic filters from Medusa */}
              {filters.map((filterGroup) => (
                <li key={filterGroup.name} className="MuiBox-root" style={{ borderBottom: "1px solid #e0e0e0" }}>
                  <button
                    className="MuiBox-root"
                    tabIndex={0}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      width: "100%",
                      padding: "16px",
                      border: "none",
                      background: "transparent",
                      cursor: "pointer",
                    }}
                  >
                    <span className="MuiBox-root">
                      <p className="MuiTypography-root MuiTypography-label-m-regular DS-Typography" style={{ margin: 0 }}>
                        {filterGroup.name}
                      </p>
                    </span>
                    <span className="MuiBox-root" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <p className="MuiTypography-root MuiTypography-label-s-regular DS-Typography" style={{ margin: 0 }}>
                        {selectedFilters[filterGroup.name]?.length > 0 ? `${selectedFilters[filterGroup.name].length} selected` : ""}
                      </p>
                      <svg
                        className="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium DS-Icon"
                        focusable="false"
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="none"
                      >
                        <path
                          fill="currentColor"
                          fillRule="evenodd"
                          d="M8.869 5.869a.7.7 0 0 1 .99 0l5.636 5.636a.7.7 0 0 1 0 .99l-5.636 5.636a.7.7 0 1 1-.99-.99L14.01 12 8.869 6.859a.7.7 0 0 1 0-.99"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                    </span>
                  </button>
                  {/* Filter options */}
                  <div style={{ padding: "0 16px 16px", display: "flex", flexDirection: "column", gap: "8px" }}>
                    {filterGroup.options.map((option) => (
                      <label
                        key={option.value}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          cursor: "pointer",
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={selectedFilters[filterGroup.name]?.includes(option.value) || false}
                          onChange={(e) => {
                            setSelectedFilters((prev) => {
                              const current = prev[filterGroup.name] || [];
                              if (e.target.checked) {
                                return { ...prev, [filterGroup.name]: [...current, option.value] };
                              } else {
                                return { ...prev, [filterGroup.name]: current.filter((v) => v !== option.value) };
                              }
                            });
                          }}
                          style={{ cursor: "pointer" }}
                        />
                        <span className="MuiTypography-root MuiTypography-label-s-regular DS-Typography" style={{ margin: 0 }}>
                          {option.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="MuiBox-root" style={{ padding: "16px", display: "flex", gap: "12px" }}>
            <button
              className="MuiButtonBase-root MuiButton-root MuiButton-contained MuiButton-containedSecondary MuiButton-sizeMedium MuiButton-containedSizeMedium MuiButton-colorSecondary MuiButton-disableElevation DS-Button"
              type="button"
              disabled
              aria-label="Reset all filters"
              style={{ flex: 1 }}
            >
              Reset all filters
            </button>
            <button
              className="MuiButtonBase-root MuiButton-root MuiButton-contained MuiButton-containedPrimary MuiButton-sizeMedium MuiButton-containedSizeMedium MuiButton-colorPrimary MuiButton-disableElevation DS-Button"
              type="button"
              aria-label="See products"
              style={{ flex: 1 }}
              onClick={hideDrawer}
            >
              <p className="MuiTypography-root MuiTypography-body1 DS-Typography" style={{ margin: 0 }}>
                {productCount !== undefined ? `See the ${productCount} product(s)` : "See products"}
              </p>
            </button>
          </div>
          </div>
        </>
      )}
    </>
  );
}
