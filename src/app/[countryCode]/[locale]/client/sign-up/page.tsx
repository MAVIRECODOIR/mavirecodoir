"use client";

import { useState, useRef, useEffect, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Package, Heart, Calendar, Headphones, Mail, ChevronLeft, Eye, EyeOff } from "lucide-react";

type PageState = "email" | "checking" | "signup" | "login-choice" | "login-password" | "login-code";

type FormData = {
  email: string;
  verificationCode: string;
  title: string;
  firstName: string;
  lastName: string;
  phone: string;
  countryCode: string;
  password: string;
  acceptsMarketing: boolean;
};

const COUNTRY_CODES = [
  { code: "+44", label: "UK +44" },
  { code: "+1", label: "US +1" },
  { code: "+33", label: "FR +33" },
  { code: "+39", label: "IT +39" },
  { code: "+49", label: "DE +49" },
  { code: "+34", label: "ES +34" },
  { code: "+41", label: "CH +41" },
  { code: "+31", label: "NL +31" },
  { code: "+32", label: "BE +32" },
  { code: "+61", label: "AU +61" },
  { code: "+81", label: "JP +81" },
  { code: "+971", label: "UAE +971" },
  { code: "+86", label: "CN +86" },
  { code: "+852", label: "HK +852" },
  { code: "+65", label: "SG +65" },
  { code: "+46", label: "SE +46" },
  { code: "+45", label: "DK +45" },
  { code: "+47", label: "NO +47" },
  { code: "+353", label: "IE +353" },
  { code: "+351", label: "PT +351" },
  { code: "+7", label: "RU +7" },
  { code: "+27", label: "ZA +27" },
  { code: "+55", label: "BR +55" },
  { code: "+52", label: "MX +52" },
  { code: "+82", label: "KR +82" },
];

const PERKS = [
  { icon: Package, text: "Check the details and monitor the status of your orders and returns" },
  { icon: Heart, text: "Create a wishlist to save your favourite items" },
  { icon: Calendar, text: "View your private appointments and repair requests" },
  { icon: Headphones, text: "Receive tailored assistance from our Client Service" },
];

export default function ClientSignUpPage() {
  const router = useRouter();
  const [pageState, setPageState] = useState<PageState>("email");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [codeTimer, setCodeTimer] = useState(0);
  const [loginMethod, setLoginMethod] = useState<"password" | "code">("password");

  const [form, setForm] = useState<FormData>({
    email: "",
    verificationCode: "",
    title: "",
    firstName: "",
    lastName: "",
    phone: "",
    countryCode: "+44",
    password: "",
    acceptsMarketing: false,
  });

  const emailRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  useEffect(() => {
    if (codeTimer <= 0) return;
    const t = setTimeout(() => setCodeTimer((p) => p - 1), 1000);
    return () => clearTimeout(t);
  }, [codeTimer]);

  const update = (field: keyof FormData, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  async function sendCode() {
    const res = await fetch("/api/account/send-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: form.email }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Something went wrong");
    setCodeSent(true);
    setCodeTimer(600);
  }

  async function handleEmailSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    setPageState("checking");

    try {
      const checkRes = await fetch("/api/account/check-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email }),
      });
      const checkData = await checkRes.json();

      if (checkData.exists) {
        setPageState("login-choice");
      } else {
        await sendCode();
        setPageState("signup");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      setError(message);
      setPageState("email");
    } finally {
      setLoading(false);
    }
  }

  async function handleSignupSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (!form.verificationCode.trim()) {
      setError("Please enter the verification code.");
      return;
    }
    if (!form.firstName.trim() || !form.lastName.trim()) {
      setError("First name and last name are required.");
      return;
    }
    if (!form.password || form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    try {
      const fullPhone = form.phone
        ? `${form.countryCode}${form.phone}`.replace(/[\s\-()]/g, "")
        : "";

      const res = await fetch("/api/account/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          code: form.verificationCode,
          firstName: form.firstName,
          lastName: form.lastName,
          phone: fullPhone,
          password: form.password,
          acceptsMarketing: form.acceptsMarketing,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");

      router.push("/client/my-account");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Registration failed";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  async function handleLoginPasswordSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (!form.password) {
      setError("Please enter your password.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/account/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Invalid email or password");

      router.push("/client/my-account");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Invalid email or password";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  async function handleLoginCodeSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (!form.verificationCode.trim()) {
      setError("Please enter the verification code.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/account/login-with-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          code: form.verificationCode,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Sign in failed");

      router.push("/client/my-account");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Sign in failed";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  function handleLoginMethodSelect(method: "password" | "code") {
    setLoginMethod(method);
    setError("");
    if (method === "code" && !codeSent) {
      sendCode().catch((err) => setError(err.message));
    }
    setPageState(method === "password" ? "login-password" : "login-code");
  }

  async function handleResendCode() {
    if (codeTimer > 0) return;
    try {
      await fetch("/api/account/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email }),
      });
      setCodeTimer(600);
    } catch {
      // silently fail
    }
  }

  const formatTimer = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  function renderEmailHeader() {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-sm p-5 mb-6">
        <div className="flex items-center justify-center mb-3">
          <div className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center">
            <Mail size={18} strokeWidth={1.5} className="text-black/70" />
          </div>
        </div>
        <p className="text-xs font-medium text-center text-black/80">
          {form.email}
        </p>
        <button
          type="button"
          onClick={() => { setPageState("email"); setError(""); setCodeSent(false); }}
          className="block mx-auto mt-1 text-[11px] font-medium underline text-black/60 hover:text-black"
        >
          Change email
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-white" style={{ minHeight: "calc(100vh - 80px)" }}>
      <div className="flex-1 flex items-center justify-center px-8">
        <div className="w-full max-w-[440px]">

          {/* ═══ STEP: Email entry ═══ */}
          {pageState === "email" && (
            <div className="animate-fade-in">
              <h1 className="text-[22px] font-medium tracking-wide text-center mb-6">
                Enter your email
              </h1>

              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <div className="relative">
                  <input
                    ref={emailRef}
                    type="email"
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                    placeholder=" "
                    className="peer w-full border-b border-gray-300 bg-transparent pt-6 pb-2 text-sm font-medium text-black outline-none transition-colors focus:border-black"
                    autoComplete="email"
                  />
                  <label className="pointer-events-none absolute left-0 top-6 text-sm text-gray-400 transition-all duration-200 peer-placeholder-shown:top-6 peer-placeholder-shown:text-sm peer-focus:top-1 peer-focus:text-[11px] peer-focus:text-black/60 peer-[:not(:placeholder-shown)]:top-1 peer-[:not(:placeholder-shown)]:text-[11px]">
                    E-mail address *
                  </label>
                </div>

                {error && (
                  <p className="text-xs text-red-600 font-medium">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-black text-white text-xs font-bold uppercase tracking-wider py-3 transition-all duration-300 hover:bg-black/85 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="inline-flex items-center gap-2">
                      <span className="h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing
                    </span>
                  ) : (
                    "Next"
                  )}
                </button>
              </form>

              <div className="mt-6 mb-4 border-t border-gray-200" />

              <div className="text-center mb-4">
                <p className="text-sm font-medium text-black/80 tracking-wide">
                  Enjoy a unique shopping experience with your personal account
                </p>
              </div>

              <ul className="space-y-3">
                {PERKS.map((perk) => (
                  <li key={perk.text} className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
                      <perk.icon size={18} strokeWidth={1.5} className="text-black/70" />
                    </div>
                    <p className="text-[13px] font-medium text-black/70 leading-relaxed pt-1">
                      {perk.text}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* ═══ STEP: Checking email ═══ */}
          {pageState === "checking" && (
            <div className="animate-fade-in text-center py-20">
              <span className="h-6 w-6 border-2 border-black/20 border-t-black rounded-full animate-spin inline-block" />
            </div>
          )}

          {/* ═══ STEP: New user signup ═══ */}
          {pageState === "signup" && (
            <div className="animate-fade-in">
              <button
                onClick={() => { setPageState("email"); setError(""); }}
                className="flex items-center gap-1 text-xs font-medium text-black/60 hover:text-black mb-6 -ml-1"
              >
                <ChevronLeft size={14} />
                Back
              </button>

              <h1 className="text-[22px] font-medium tracking-wide text-center mb-3">
                Create your personal account
              </h1>
              <p className="text-xs text-black/60 leading-relaxed text-center mb-6 max-w-sm mx-auto">
                This will allow us to offer you a personalised and tailored experience
                both online and in-store, and give you access to exclusive services and
                benefits reserved for registered members.
              </p>

              {renderEmailHeader()}

              <form onSubmit={handleSignupSubmit} className="space-y-5">
                <div className="relative">
                  <input
                    type="text"
                    value={form.verificationCode}
                    onChange={(e) => update("verificationCode", e.target.value)}
                    placeholder=" "
                    className="peer w-full border-b border-gray-300 bg-transparent pt-6 pb-2 text-sm font-medium text-black outline-none transition-colors focus:border-black"
                    autoComplete="one-time-code"
                  />
                  <label className="pointer-events-none absolute left-0 top-6 text-sm text-gray-400 transition-all duration-200 peer-placeholder-shown:top-6 peer-placeholder-shown:text-sm peer-focus:top-1 peer-focus:text-[11px] peer-focus:text-black/60 peer-[:not(:placeholder-shown)]:top-1 peer-[:not(:placeholder-shown)]:text-[11px]">
                    Verification code *
                  </label>
                  <div className="flex items-center justify-between mt-1.5">
                    <span className="text-[11px] text-black/40">
                      {codeTimer > 0 ? `Code expires in ${formatTimer(codeTimer)}` : "Code expired"}
                    </span>
                    <button
                      type="button"
                      onClick={handleResendCode}
                      disabled={codeTimer > 0}
                      className="text-[11px] font-medium underline text-black/60 hover:text-black disabled:text-black/30 disabled:no-underline"
                    >
                      Resend
                    </button>
                  </div>
                </div>

                <div className="relative">
                  <select
                    value={form.title}
                    onChange={(e) => update("title", e.target.value)}
                    className="w-full border-b border-gray-300 bg-transparent pt-6 pb-2 text-sm font-medium text-black outline-none transition-colors focus:border-black appearance-none cursor-pointer"
                  >
                    <option value="">Select title *</option>
                    <option value="Mr">Mr.</option>
                    <option value="Ms">Ms.</option>
                    <option value="Mrs">Mrs.</option>
                    <option value="Mx">Mx.</option>
                    <option value="prefer_not">I&apos;d rather not say</option>
                  </select>
                  <label className="pointer-events-none absolute left-0 top-1 text-[11px] text-black/60">
                    Title
                  </label>
                  <div className="pointer-events-none absolute right-0 top-6">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-black/40">
                      <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <input
                      type="text"
                      value={form.firstName}
                      onChange={(e) => update("firstName", e.target.value)}
                      placeholder=" "
                      className="peer w-full border-b border-gray-300 bg-transparent pt-6 pb-2 text-sm font-medium text-black outline-none transition-colors focus:border-black"
                      autoComplete="given-name"
                    />
                    <label className="pointer-events-none absolute left-0 top-6 text-sm text-gray-400 transition-all duration-200 peer-placeholder-shown:top-6 peer-placeholder-shown:text-sm peer-focus:top-1 peer-focus:text-[11px] peer-focus:text-black/60 peer-[:not(:placeholder-shown)]:top-1 peer-[:not(:placeholder-shown)]:text-[11px]">
                      First name *
                    </label>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      value={form.lastName}
                      onChange={(e) => update("lastName", e.target.value)}
                      placeholder=" "
                      className="peer w-full border-b border-gray-300 bg-transparent pt-6 pb-2 text-sm font-medium text-black outline-none transition-colors focus:border-black"
                      autoComplete="family-name"
                    />
                    <label className="pointer-events-none absolute left-0 top-6 text-sm text-gray-400 transition-all duration-200 peer-placeholder-shown:top-6 peer-placeholder-shown:text-sm peer-focus:top-1 peer-focus:text-[11px] peer-focus:text-black/60 peer-[:not(:placeholder-shown)]:top-1 peer-[:not(:placeholder-shown)]:text-[11px]">
                      Last name *
                    </label>
                  </div>
                </div>

                <div className="relative">
                  <div className="flex border-b border-gray-300 peer-focus-within:border-black transition-colors">
                    <select
                      value={form.countryCode}
                      onChange={(e) => update("countryCode", e.target.value)}
                      className="bg-transparent pt-6 pb-2 text-sm font-medium text-black outline-none appearance-none cursor-pointer pr-2"
                    >
                      {COUNTRY_CODES.map((c) => (
                        <option key={c.code} value={c.code}>{c.code}</option>
                      ))}
                    </select>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => update("phone", e.target.value.replace(/[^0-9\s\-()]/g, ""))}
                      placeholder=" "
                      className="peer flex-1 bg-transparent pt-6 pb-2 text-sm font-medium text-black outline-none"
                      autoComplete="tel"
                    />
                    <label className="pointer-events-none absolute left-0 top-6 text-sm text-gray-400 transition-all duration-200 peer-placeholder-shown:top-6 peer-placeholder-shown:text-sm peer-focus:top-1 peer-focus:text-[11px] peer-focus:text-black/60 peer-[:not(:placeholder-shown)]:top-1 peer-[:not(:placeholder-shown)]:text-[11px]">
                      Phone number
                    </label>
                  </div>
                </div>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={(e) => update("password", e.target.value)}
                    placeholder=" "
                    className="peer w-full border-b border-gray-300 bg-transparent pt-6 pb-2 pr-10 text-sm font-medium text-black outline-none transition-colors focus:border-black"
                    autoComplete="new-password"
                  />
                  <label className="pointer-events-none absolute left-0 top-6 text-sm text-gray-400 transition-all duration-200 peer-placeholder-shown:top-6 peer-placeholder-shown:text-sm peer-focus:top-1 peer-focus:text-[11px] peer-focus:text-black/60 peer-[:not(:placeholder-shown)]:top-1 peer-[:not(:placeholder-shown)]:text-[11px]">
                    Password *
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 top-5 p-1 text-black/40 hover:text-black/70"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                  <p className="text-[11px] text-black/40 mt-1.5">Minimum 8 characters</p>
                </div>

                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="relative flex-shrink-0 mt-0.5">
                    <input
                      type="checkbox"
                      checked={form.acceptsMarketing}
                      onChange={(e) => update("acceptsMarketing", e.target.checked)}
                      className="sr-only"
                    />
                    <div className={`w-4 h-4 border transition-colors ${form.acceptsMarketing ? "bg-black border-black" : "border-gray-300 group-hover:border-gray-400"}`}>
                      {form.acceptsMarketing && (
                        <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4 text-white">
                          <path d="M4 8L7 11L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <span className="text-xs text-black/60 leading-relaxed">
                    I would like to receive communications about MAVIRE CODOIR products,
                    services, and events. You can unsubscribe at any time.
                  </span>
                </label>

                {error && (
                  <p className="text-xs text-red-600 font-medium">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-black text-white text-xs font-bold uppercase tracking-wider py-4 transition-all duration-300 hover:bg-black/85 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="inline-flex items-center gap-2">
                      <span className="h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Creating account
                    </span>
                  ) : (
                    "Register"
                  )}
                </button>

                <p className="text-[11px] text-black/40 leading-relaxed text-center">
                  By registering, you agree to our{" "}
                  <Link href="/terms" className="underline hover:text-black/70">Terms & Conditions</Link>
                  {" "}and{" "}
                  <Link href="/privacy" className="underline hover:text-black/70">Privacy Policy</Link>.
                </p>
              </form>
            </div>
          )}

          {/* ═══ STEP: Existing user — login choice ═══ */}
          {pageState === "login-choice" && (
            <div className="animate-fade-in">
              <button
                onClick={() => { setPageState("email"); setError(""); }}
                className="flex items-center gap-1 text-xs font-medium text-black/60 hover:text-black mb-6 -ml-1"
              >
                <ChevronLeft size={14} />
                Back
              </button>

              <h1 className="text-[22px] font-medium tracking-wide text-center mb-3">
                Welcome back
              </h1>
              <p className="text-xs text-black/60 leading-relaxed text-center mb-8 max-w-sm mx-auto">
                Sign in to your account to access your orders, wishlist, and more.
              </p>

              {renderEmailHeader()}

              <div className="space-y-3">
                <button
                  onClick={() => handleLoginMethodSelect("password")}
                  className="w-full bg-black text-white text-xs font-bold uppercase tracking-wider py-4 transition-all duration-300 hover:bg-black/85"
                >
                  Sign in with password
                </button>
                <button
                  onClick={() => handleLoginMethodSelect("code")}
                  className="w-full bg-white text-black text-xs font-bold uppercase tracking-wider py-4 border border-black transition-all duration-300 hover:bg-black/5"
                >
                  Sign in with verification code
                </button>
              </div>
            </div>
          )}

          {/* ═══ STEP: Existing user — login with password ═══ */}
          {pageState === "login-password" && (
            <div className="animate-fade-in">
              <button
                onClick={() => { setPageState("login-choice"); setError(""); }}
                className="flex items-center gap-1 text-xs font-medium text-black/60 hover:text-black mb-6 -ml-1"
              >
                <ChevronLeft size={14} />
                Back
              </button>

              <h1 className="text-[22px] font-medium tracking-wide text-center mb-6">
                Enter your password
              </h1>

              {renderEmailHeader()}

              <form onSubmit={handleLoginPasswordSubmit} className="space-y-5">
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={(e) => update("password", e.target.value)}
                    placeholder=" "
                    className="peer w-full border-b border-gray-300 bg-transparent pt-6 pb-2 pr-10 text-sm font-medium text-black outline-none transition-colors focus:border-black"
                    autoComplete="current-password"
                  />
                  <label className="pointer-events-none absolute left-0 top-6 text-sm text-gray-400 transition-all duration-200 peer-placeholder-shown:top-6 peer-placeholder-shown:text-sm peer-focus:top-1 peer-focus:text-[11px] peer-focus:text-black/60 peer-[:not(:placeholder-shown)]:top-1 peer-[:not(:placeholder-shown)]:text-[11px]">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 top-5 p-1 text-black/40 hover:text-black/70"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                {error && (
                  <p className="text-xs text-red-600 font-medium">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-black text-white text-xs font-bold uppercase tracking-wider py-4 transition-all duration-300 hover:bg-black/85 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="inline-flex items-center gap-2">
                      <span className="h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Signing in
                    </span>
                  ) : (
                    "Sign in"
                  )}
                </button>
              </form>
            </div>
          )}

          {/* ═══ STEP: Existing user — login with code ═══ */}
          {pageState === "login-code" && (
            <div className="animate-fade-in">
              <button
                onClick={() => { setPageState("login-choice"); setError(""); }}
                className="flex items-center gap-1 text-xs font-medium text-black/60 hover:text-black mb-6 -ml-1"
              >
                <ChevronLeft size={14} />
                Back
              </button>

              <h1 className="text-[22px] font-medium tracking-wide text-center mb-6">
                Enter verification code
              </h1>

              {renderEmailHeader()}

              <form onSubmit={handleLoginCodeSubmit} className="space-y-5">
                <div className="relative">
                  <input
                    type="text"
                    value={form.verificationCode}
                    onChange={(e) => update("verificationCode", e.target.value)}
                    placeholder=" "
                    className="peer w-full border-b border-gray-300 bg-transparent pt-6 pb-2 text-sm font-medium text-black outline-none transition-colors focus:border-black"
                    autoComplete="one-time-code"
                  />
                  <label className="pointer-events-none absolute left-0 top-6 text-sm text-gray-400 transition-all duration-200 peer-placeholder-shown:top-6 peer-placeholder-shown:text-sm peer-focus:top-1 peer-focus:text-[11px] peer-focus:text-black/60 peer-[:not(:placeholder-shown)]:top-1 peer-[:not(:placeholder-shown)]:text-[11px]">
                    Verification code *
                  </label>
                  <div className="flex items-center justify-between mt-1.5">
                    <span className="text-[11px] text-black/40">
                      {codeTimer > 0 ? `Code expires in ${formatTimer(codeTimer)}` : "Code expired"}
                    </span>
                    <button
                      type="button"
                      onClick={handleResendCode}
                      disabled={codeTimer > 0}
                      className="text-[11px] font-medium underline text-black/60 hover:text-black disabled:text-black/30 disabled:no-underline"
                    >
                      Resend
                    </button>
                  </div>
                </div>

                {error && (
                  <p className="text-xs text-red-600 font-medium">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-black text-white text-xs font-bold uppercase tracking-wider py-4 transition-all duration-300 hover:bg-black/85 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="inline-flex items-center gap-2">
                      <span className="h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Signing in
                    </span>
                  ) : (
                    "Sign in"
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      <footer className="border-t border-gray-200 py-2">
        <p className="text-center text-[10px] tracking-wider text-black/30">
          &copy; {new Date().getFullYear()} MAVIRE CODOIR
        </p>
      </footer>
    </div>
  );
}
