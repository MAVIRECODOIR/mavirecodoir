"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Backdrop from "./Backdrop";

export default function CookiePopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = window.localStorage.getItem("cookie-consent");
    if (consent) return;

    const timer = window.setTimeout(() => {
      setIsOpen(true);
    }, 5000);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setIsMounted(true);
      requestAnimationFrame(() => setIsVisible(true));
      return;
    }

    setIsVisible(false);
    if (!isMounted) return;

    const timeoutId = window.setTimeout(() => {
      setIsMounted(false);
    }, 360);

    return () => window.clearTimeout(timeoutId);
  }, [isOpen, isMounted]);

  const handleDismiss = (choice?: "accepted" | "rejected") => {
    if (choice) {
      window.localStorage.setItem("cookie-consent", choice);
    }
    setIsOpen(false);
  };

  if (!isMounted) return null;

  return (
    <>
      <Backdrop isOpen={isVisible} onClose={() => handleDismiss()} zIndex={349} />
      <div
        id="onetrust-banner-sdk"
        className={`otCenterRounded default ot-wo-title vertical-align-content fixed inset-0 z-[350] flex items-end justify-center p-2 sm:p-4 transition-opacity duration-300 ease-out ${
          isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        role="region"
        aria-label="Cookie banner"
        tabIndex={0}
      >
        <div
          className={`ot-sdk-container w-full max-w-[980px] rounded-sm border border-[#c8c8c8] bg-[#f5f5f5] shadow-[0_14px_36px_rgba(0,0,0,0.25)] transition-all duration-300 ease-out ${
            isVisible ? "translate-y-0" : "translate-y-6"
          }`}
          role="dialog"
          aria-modal="true"
          aria-label="Privacy"
        >
          <div className="ot-sdk-row">
            <div className="flex items-start justify-between border-b border-[#d0d0d0] px-5 py-4 sm:px-8">
              <div id="onetrust-group-container" className="ot-sdk-twelve ot-sdk-columns pr-4">
                <div id="onetrust-policy">
                  <div className="banner-header mb-3">
                    <div className="banner_logo w-[110px]">
                      <Image
                        src="https://pub-cb269c46bd284333bcafb48988f70133.r2.dev/brand/logos/png/1771394628214-zkowej-Mavire%20Codoir%20-%20LOGO.webp"
                        alt="MAVIRE CODOIR"
                        width={1390}
                        height={213}
                        unoptimized
                        className="w-full object-contain"
                        priority
                      />
                    </div>
                  </div>
                  <div id="onetrust-policy-text" className="text-[13px] leading-6 text-[#1f1f1f] sm:text-[14px]">
                    We use cookies, including third party cookies, for operational purposes, statistical analyses, to personalise your experience, provide you with targeted content tailored to your interests and to analyse the performance of our advertising campaigns. You can accept these cookies by clicking on “Accept all”, or clicking on “Personalise my choices” to manage your preferences.
                    <br />
                    <br />
                    You can change your preferences at any time at the bottom of the mavirecodoir.com website.
                    <br />
                    <br />
                    To find out more about the different types of cookies, as well as who sends them on our website, please visit our dedicated guide
                    <a
                      href="https://mavirecodoir.com/privacy"
                      target="_blank"
                      rel="noreferrer"
                      className="underline"
                    >
                      {" "}to managing cookies.
                    </a>
                  </div>
                </div>
              </div>

              <div id="onetrust-close-btn-container">
                <button
                  type="button"
                  onClick={() => handleDismiss()}
                  className="h-10 w-10 border border-[#8f8f8f] bg-transparent text-[24px] leading-none text-[#555] transition-colors duration-200 hover:bg-[#ececec]"
                  aria-label="Close cookie banner"
                >
                  ×
                </button>
              </div>
            </div>

            <div
              id="onetrust-button-group-parent"
              className="ot-sdk-twelve ot-sdk-columns has-reject-all-button border-t border-[#d0d0d0] px-5 py-4 sm:px-8"
            >
              <div id="onetrust-button-group" className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <button
                  id="onetrust-pc-btn-handler"
                  onClick={() => handleDismiss()}
                  aria-label="Cookies Settings, Opens the preference center dialog"
                  className="text-left text-[14px] font-medium underline"
                >
                  Cookies Settings
                </button>
                <div className="banner-actions-container flex flex-col gap-3 sm:flex-row">
                  <button
                    id="onetrust-reject-all-handler"
                    onClick={() => handleDismiss("rejected")}
                    className="h-11 min-w-[170px] bg-black px-5 text-[13px] font-semibold tracking-[0.06em] text-white uppercase transition-opacity duration-200 hover:opacity-85"
                  >
                    Reject All
                  </button>
                  <button
                    id="onetrust-accept-btn-handler"
                    onClick={() => handleDismiss("accepted")}
                    className="h-11 min-w-[190px] bg-black px-5 text-[13px] font-semibold tracking-[0.06em] text-white uppercase transition-opacity duration-200 hover:opacity-85"
                  >
                    Accept All Cookies
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
