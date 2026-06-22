"use client";

import { useEffect, useState } from "react";

interface BackdropProps {
  isOpen: boolean;
  onClose?: () => void;
  zIndex?: number;
}

export default function Backdrop({ isOpen, onClose, zIndex = 40 }: BackdropProps) {
  const [isMounted, setIsMounted] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setIsMounted(true);
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setIsMounted(false);
    }, 320);

    return () => window.clearTimeout(timeoutId);
  }, [isOpen]);

  if (!isMounted) return null;

  return (
    <div
      className={`fixed inset-0 bg-black/30 transition-opacity duration-300 ease-out ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      style={{
        zIndex,
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
      }}
      onClick={onClose}
      aria-hidden="true"
    />
  );
}
