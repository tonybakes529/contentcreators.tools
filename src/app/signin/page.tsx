"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Icons } from "@/components/icons";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("sending");
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      setError(error.message);
      setStatus("error");
      return;
    }
    setStatus("sent");
  }

  return (
    <div className="signin">
      <div className="signin-card">
        <div className="signin-eyebrow mono">
          <span className="dot" />
          <span>Free account · unlocks your Brain</span>
        </div>
        <h1>Save your <em>Brain</em>.</h1>
        <p className="signin-sub">
          Drop your email. We send you a one-click sign-in link. No password,
          no setup. Your Brain — voice, audience, guardrails — saves so every
          tool sounds like you next time.
        </p>

        {status === "sent" ? (
          <div className="signin-success">
            <strong>Check your inbox.</strong>
            <p>We sent a sign-in link to <code>{email}</code>. Click it and you&apos;re in.</p>
            <button
              type="button"
              className="btn-ghost"
              style={{ marginTop: 16 }}
              onClick={() => {
                setStatus("idle");
                setEmail("");
              }}
            >
              Use a different email
            </button>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="signin-form">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              disabled={status === "sending"}
            />
            <button type="submit" className="btn-primary" disabled={status === "sending"}>
              {status === "sending" ? "Sending…" : (
                <>
                  Send sign-in link
                  {Icons.arrow}
                </>
              )}
            </button>
            {error ? <div className="signin-error">{error}</div> : null}
          </form>
        )}

        <div className="signin-foot">
          <Link href="/">← Back to tools</Link>
        </div>
      </div>
    </div>
  );
}
