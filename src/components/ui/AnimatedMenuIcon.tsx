"use client";

/**
 * AnimatedMenuIcon
 *
 * An animated hamburger-to-arrow menu icon extracted from the Framer
 * HamburgerMenu module. Removes the framer-specific `addPropertyControls`
 * dependency so it works natively in Next.js.
 *
 * - When `isOpen` is false, renders a three-line hamburger.
 * - When `isOpen` is true, animates to an arrow/close shape via
 *   stroke-dasharray / stroke-dashoffset transitions.
 * - The entire SVG rotates -45deg on open for a polished reveal.
 */

import type { CSSProperties } from "react";

interface AnimatedMenuIconProps {
  color?: string;
  size?: number;
  isOpen: boolean;
  strokeWidth?: number;
  className?: string;
  style?: CSSProperties;
}

export default function AnimatedMenuIcon({
  color = "#000000",
  size = 24,
  isOpen = false,
  strokeWidth = 2.5,
  className,
  style,
}: AnimatedMenuIconProps) {
  const dur = "600ms";
  const easing = "cubic-bezier(0.4, 0, 0.2, 1)";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      className={className}
      style={{
        transform: isOpen ? "rotate(-45deg)" : "rotate(0deg)",
        transition: `transform ${dur} ${easing}`,
        ...style,
      }}
    >
      {/* Top + bottom lines (animate into arrow) */}
      <path
        d="M27 10 13 10C10.8 10 9 8.2 9 6 9 3.5 10.8 2 13 2 15.2 2 17 3.8 17 6L17 26C17 28.2 18.8 30 21 30 23.2 30 25 28.2 25 26 25 23.8 23.2 22 21 22L7 22"
        fill="none"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
        strokeDasharray={isOpen ? "20 300" : "12 63"}
        strokeDashoffset={isOpen ? -32.42 : 0}
        style={{
          transition: `stroke-dasharray ${dur} ${easing}, stroke-dashoffset ${dur} ${easing}`,
        }}
      />
      {/* Middle line */}
      <path
        d="M7 16 27 16"
        fill="none"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
        style={{
          transition: `stroke-dasharray ${dur} ${easing}, stroke-dashoffset ${dur} ${easing}`,
        }}
      />
    </svg>
  );
}
