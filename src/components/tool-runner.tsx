"use client";

import { useState } from "react";
import Link from "next/link";
import { Icons } from "./icons";
import type { ToolInputField } from "@/lib/tools-db";

type Props = {
  toolSlug: string;
  toolName: string;
  toolDesc: string;
  inputs: ToolInputField[];
  categorySlug: string;
  categoryName: string;
};

type RunResult = {
  output: string;
  latencyMs: number;
  isSignedIn: boolean;
  brainUsed: boolean;
};

export default function ToolRunner({
  toolSlug,
  toolName,
  toolDesc,
  inputs,
  categorySlug,
  categoryName,
}: Props) {
  const [values, setValues] = useState<Record<string, string>>(
    () => Object.fromEntries(inputs.map((f) => [f.name, ""])),
  );
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<RunResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [rateLimited, setRateLimited] = useState(false);

  async function onRun(e: React.FormEvent) {
    e.preventDefault();
    setRunning(true);
    setError(null);
    setRateLimited(false);
    setResult(null);
    try {
      const res = await fetch("/api/run-tool", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toolSlug, inputs: values }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 429) setRateLimited(true);
        setError(data.error || "Something went wrong.");
        return;
      }
      setResult(data as RunResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error.");
    } finally {
      setRunning(false);
    }
  }

  return (
    <div className="runner">
      <div className="runner-head">
        <div className="runner-eyebrow mono">
          <span className="dot" />
          <span>{categoryName} · Live</span>
        </div>
        <h1>{toolName}</h1>
        <p className="runner-sub">{toolDesc}</p>
      </div>

      <form onSubmit={onRun} className="runner-form">
        {inputs.map((f) => (
          <div key={f.name} className="runner-field">
            <label htmlFor={`f-${f.name}`}>{f.label}</label>
            {f.type === "textarea" ? (
              <textarea
                id={`f-${f.name}`}
                rows={f.rows ?? 5}
                placeholder={f.placeholder}
                value={values[f.name] ?? ""}
                onChange={(e) => setValues((v) => ({ ...v, [f.name]: e.target.value }))}
                required={f.required}
              />
            ) : (
              <input
                id={`f-${f.name}`}
                type="text"
                placeholder={f.placeholder}
                value={values[f.name] ?? ""}
                onChange={(e) => setValues((v) => ({ ...v, [f.name]: e.target.value }))}
                required={f.required}
              />
            )}
          </div>
        ))}
        <div className="runner-actions">
          <button type="submit" className="btn-primary" disabled={running}>
            {running ? "Running…" : (
              <>
                Run {toolName}
                {Icons.arrow}
              </>
            )}
          </button>
          <Link href={`/${categorySlug}`} className="btn-ghost">
            Back to {categoryName}
          </Link>
        </div>
      </form>

      {error ? (
        <div className={`runner-error${rateLimited ? " is-rate" : ""}`}>
          <strong>{rateLimited ? "Limit reached." : "Something went wrong."}</strong>
          <p>{error}</p>
          {rateLimited ? (
            <Link href="/signin" className="btn-primary" style={{ marginTop: 12 }}>
              Create a free account
              {Icons.arrow}
            </Link>
          ) : null}
        </div>
      ) : null}

      {result ? (
        <div className="runner-output">
          <div className="runner-output-head">
            <div className="runner-output-label mono">Result</div>
            <div className="runner-output-meta mono">
              {result.brainUsed ? "Brain-powered" : "Generic"} · {result.latencyMs} ms
            </div>
          </div>
          <pre>{result.output}</pre>
          {!result.isSignedIn ? (
            <div className="runner-upsell">
              <div className="runner-upsell-body">
                <strong>These would sound like <em>you</em></strong>
                <p>Save your Brain — voice, audience, guardrails — and every tool gets sharper.</p>
              </div>
              <Link href="/signin" className="btn-primary">
                Save my Brain
                {Icons.arrow}
              </Link>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
