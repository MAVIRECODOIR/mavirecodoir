"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useState, useEffect, FormEvent } from "react";

const BRAND = "MAVIRE CODOIR";

function UnsubscribeForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const emailParam = searchParams?.get("email") ?? null;
  const listId = searchParams?.get("list_id") || searchParams?.get("listId");
  const brevoId = searchParams?.get("id") || searchParams?.get("contact_id");

  const [email, setEmail] = useState(emailParam || "");
  const [reason, setReason] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (emailParam) setEmail(emailParam);
  }, [emailParam]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || ""}/store/brevo/unsubscribe`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, listId, brevoId, reason }),
        }
      );

      if (res.ok) {
        setStatus("success");
        setMessage("You have been successfully unsubscribed.");
      } else {
        const data = await res.json().catch(() => ({}));
        setStatus("error");
        setMessage(data.message || "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setMessage("Unable to connect. Please try again later.");
    }
  };

  if (status === "success") {
    return (
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            background: "#19543A",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 24px",
            fontSize: 22,
            color: "#fff",
          }}
        >
          &#10003;
        </div>
        <p style={{ margin: "0 0 8px", fontSize: 15, color: "#000", fontWeight: 500 }}>
          {message}
        </p>
        <p style={{ margin: 0, fontSize: 13, color: "#666" }}>
          You will no longer receive marketing emails from {BRAND}.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: 20 }}>
        <label
          htmlFor="email"
          style={{
            display: "block",
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "#666",
            marginBottom: 6,
          }}
        >
          Email address
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          readOnly={!!emailParam}
          style={{
            width: "100%",
            padding: "10px 12px",
            fontSize: 13,
            border: "1px solid #ddd",
            borderRadius: 0,
            outline: "none",
            background: emailParam ? "#f7f7f7" : "#fff",
            boxSizing: "border-box",
          }}
        />
      </div>

      <div style={{ marginBottom: 24 }}>
        <label
          htmlFor="reason"
          style={{
            display: "block",
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "#666",
            marginBottom: 6,
          }}
        >
          Reason (optional)
        </label>
        <select
          id="reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          style={{
            width: "100%",
            padding: "10px 12px",
            fontSize: 13,
            border: "1px solid #ddd",
            borderRadius: 0,
            outline: "none",
            background: "#fff",
            boxSizing: "border-box",
            appearance: "none",
          }}
        >
          <option value="">Select a reason</option>
          <option value="too_many">Too many emails</option>
          <option value="not_interested">Not interested anymore</option>
          <option value="irrelevant">Content not relevant</option>
          <option value="never_subscribed">I never subscribed</option>
          <option value="other">Other</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        style={{
          width: "100%",
          padding: "12px 24px",
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          background: status === "loading" ? "#999" : "#000",
          color: "#fff",
          border: "none",
          cursor: status === "loading" ? "not-allowed" : "pointer",
        }}
      >
        {status === "loading" ? "Unsubscribing..." : "Unsubscribe"}
      </button>

      {status === "error" && (
        <p style={{ margin: "16px 0 0", fontSize: 12, color: "#c00", textAlign: "center" }}>
          {message}
        </p>
      )}
    </form>
  );
}

export default function UnsubscribePage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f7f7f7",
        fontFamily: "Helvetica, Arial, sans-serif",
        padding: 20,
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 420,
          background: "#fff",
          padding: "40px 36px",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <h1
            style={{
              margin: "0 0 4px",
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#000",
            }}
          >
            Unsubscribe
          </h1>
          <p style={{ margin: 0, fontSize: 12, color: "#999" }}>
            You are unsubscribing from {BRAND} marketing emails.
          </p>
        </div>

        <Suspense
          fallback={
            <p style={{ textAlign: "center", fontSize: 12, color: "#999" }}>Loading...</p>
          }
        >
          <UnsubscribeForm />
        </Suspense>

        <div style={{ textAlign: "center", marginTop: 24 }}>
          <a
            href="/"
            style={{ fontSize: 11, color: "#999", textDecoration: "underline", letterSpacing: "0.04em" }}
          >
            Back to {BRAND}
          </a>
        </div>
      </div>
    </div>
  );
}
