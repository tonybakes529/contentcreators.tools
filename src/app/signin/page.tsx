"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Icons } from "@/components/icons";

type Mode = "signin" | "signup";

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="signin" />}>
      <SignInForm />
    </Suspense>
  );
}

function SignInForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting">("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !password) return;
    setStatus("submitting");
    setError(null);

    const supabase = createClient();
    const next = params.get("next") || "/brain";

    if (mode === "signin") {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error) {
        setError(error.message);
        setStatus("idle");
        return;
      }
    } else {
      // Sign up. Email confirmation must be DISABLED in
      // Supabase Auth → Providers → Email for this to land the user
      // signed in immediately (no inbox round-trip).
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
      });
      if (error) {
        setError(error.message);
        setStatus("idle");
        return;
      }
      // If confirmation is still required, there will be no session yet.
      if (!data.session) {
        setError(
          "Account created but email confirmation is still enabled in Supabase. Disable it under Auth → Providers → Email, or check your inbox.",
        );
        setStatus("idle");
        return;
      }
    }

    // Refresh server components so the new session is picked up
    router.refresh();
    router.push(next);
  }

  return (
    <div className="signin">
      <div className="signin-card">
        <div className="signin-eyebrow mono">
          <span className="dot" />
          <span>Free account · unlocks your Brain</span>
        </div>
        <h1>{mode === "signin" ? "Welcome back." : "Make your account."}</h1>
        <p className="signin-sub">
          {mode === "signin"
            ? "Sign in with your email and password."
            : "Email + password. We skip the email confirmation while we're building, so you're in instantly."}
        </p>

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
            disabled={status === "submitting"}
          />
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            required
            minLength={6}
            autoComplete={mode === "signin" ? "current-password" : "new-password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={mode === "signin" ? "Your password" : "At least 6 characters"}
            disabled={status === "submitting"}
          />
          <button type="submit" className="btn-primary" disabled={status === "submitting"}>
            {status === "submitting"
              ? "…"
              : mode === "signin"
                ? <>Sign in {Icons.arrow}</>
                : <>Create account {Icons.arrow}</>}
          </button>
          {error ? <div className="signin-error">{error}</div> : null}
        </form>

        <div className="signin-toggle">
          {mode === "signin" ? (
            <>
              First time?{" "}
              <button type="button" onClick={() => { setMode("signup"); setError(null); }}>
                Create an account
              </button>
            </>
          ) : (
            <>
              Already have one?{" "}
              <button type="button" onClick={() => { setMode("signin"); setError(null); }}>
                Sign in
              </button>
            </>
          )}
        </div>

        <div className="signin-foot">
          <Link href="/">← Back to tools</Link>
        </div>
      </div>
    </div>
  );
}
