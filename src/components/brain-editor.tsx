"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Icons } from "./icons";
import { saveBrainField } from "@/lib/brain-actions";
import type { Brain } from "@/lib/brain";

type BrainDoc = {
  id: string;
  filename: string;
  mime_type: string;
  size_bytes: number;
  created_at: string;
};

type Props = {
  initialBrain: Brain;
  isSignedIn: boolean;
  docs: BrainDoc[];
};

type SaveStatus = "idle" | "saving" | "saved" | "needs_signin" | "error";

function useDebouncedSave(field: string, value: unknown, isSignedIn: boolean, delayMs = 800) {
  const [status, setStatus] = useState<SaveStatus>("idle");
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    if (!isSignedIn) {
      setStatus("needs_signin");
      return;
    }
    setStatus("saving");
    const handle = setTimeout(async () => {
      const res = await saveBrainField(field, value);
      setStatus(res.ok ? "saved" : "error");
    }, delayMs);
    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [field, JSON.stringify(value), isSignedIn]);
  return status;
}

export default function BrainEditor({ initialBrain, isSignedIn, docs }: Props) {
  return (
    <div className="brain">
      <BrainHead isSignedIn={isSignedIn} hasVoice={!!initialBrain.voice_samples} />
      <VoiceSection initialValue={initialBrain.voice_samples} isSignedIn={isSignedIn} />
      <ContextSection
        identity={(initialBrain.identity as IdentityShape) ?? {}}
        audience={(initialBrain.audience as AudienceShape) ?? {}}
        offer={(initialBrain.offer as OfferShape) ?? {}}
        isSignedIn={isSignedIn}
      />
      <GuardrailsSection
        initial={(initialBrain.guardrails as GuardrailsShape) ?? {}}
        isSignedIn={isSignedIn}
      />
      <LibrarySection docs={docs} isSignedIn={isSignedIn} />
    </div>
  );
}

function BrainHead({ isSignedIn, hasVoice }: { isSignedIn: boolean; hasVoice: boolean }) {
  return (
    <div className="brain-head">
      <div className="brain-eyebrow mono">
        <span className="dot" />
        <span>
          {isSignedIn
            ? hasVoice
              ? "Brain saved · powering every tool"
              : "Knowledge base · ready to fill in"
            : "Sign in to save your Brain"}
        </span>
      </div>
      <h1>Your <em>brain</em>.</h1>
      <p>
        Drop in your voice, your audience, your offer, your past work. Every
        tool reads from this — the more it knows, the more your output sounds
        like you, not generic AI.
      </p>
      {!isSignedIn ? (
        <div className="brain-signin-banner">
          <div>
            <strong>You&apos;re editing in preview mode.</strong>
            <p>Anything you type here won&apos;t save until you sign in — free, one click.</p>
          </div>
          <Link href="/signin" className="btn-primary">
            Save my Brain
            {Icons.arrow}
          </Link>
        </div>
      ) : null}
    </div>
  );
}

function VoiceSection({ initialValue, isSignedIn }: { initialValue: string; isSignedIn: boolean }) {
  type Tab = "paste" | "upload" | "link";
  const [tab, setTab] = useState<Tab>("paste");
  const [text, setText] = useState(initialValue);
  const status = useDebouncedSave("voice_samples", text, isSignedIn);

  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const samples = text.trim() ? text.trim().split(/\n\s*\n/).filter(Boolean).length : 0;

  return (
    <div className="brain-section">
      <div className="brain-section-head">
        <div>
          <div className="brain-section-num mono">01 · The centerpiece</div>
          <h2>Your <em>voice</em>.</h2>
        </div>
        <div className="brain-section-meta">Used by 8 tools</div>
      </div>

      <div className="brain-voice">
        <div className="brain-voice-l">
          <h3>The single biggest <em>accuracy</em> unlock.</h3>
          <p>
            Paste 3–5 of your best posts, drop a transcript, or upload a brand
            guide. Every tool learns from this — hooks, captions, carousels,
            LinkedIn posts, scripts. Without it you get generic. With it you
            get you.
          </p>
          <ul>
            <li>Use real posts, not your &ldquo;professional&rdquo; ones.</li>
            <li>More ≠ better. 3 great samples beat 20 mediocre ones.</li>
            <li>Include the casual ones — that&apos;s where your voice lives.</li>
          </ul>
          <div className="brain-usage">
            <span className="brain-usage-label">Used by</span>
            <span className="brain-chip">Hook Writer</span>
            <span className="brain-chip">Carousel Builder</span>
            <span className="brain-chip">Caption Writer</span>
            <span className="brain-chip">LinkedIn Post Checker</span>
            <span className="brain-chip brain-chip-more">+ 4 more</span>
          </div>
        </div>
        <div className="brain-voice-r">
          <div className="brain-voice-tabs">
            {(["paste", "upload", "link"] as Tab[]).map((t) => (
              <button
                key={t}
                type="button"
                className={`brain-voice-tab${tab === t ? " is-active" : ""}`}
                onClick={() => setTab(t)}
              >
                {t === "paste" ? "Paste samples" : t === "upload" ? "Upload transcript" : "Link profile"}
              </button>
            ))}
          </div>
          <textarea
            className="brain-voice-textarea"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={
              "Paste 3–5 of your best posts here. Separate each one with a blank line."
            }
          />
          <div className="brain-voice-foot">
            <div className="brain-voice-count">
              <strong>{samples}</strong> sample{samples === 1 ? "" : "s"} · {words.toLocaleString()} word{words === 1 ? "" : "s"}
            </div>
            <SaveBadge status={status} />
          </div>
        </div>
      </div>
    </div>
  );
}

type IdentityShape = { name?: string; title?: string; bio?: string };
type AudienceShape = { who?: string; problems?: string };
type OfferShape = { cta?: string; what_you_sell?: string };
type GuardrailsShape = {
  words?: string;
  topics?: string;
  tone?: string;
  hooks?: string;
  claims?: string;
  formatting?: string;
};

function ContextSection({
  identity,
  audience,
  offer,
  isSignedIn,
}: {
  identity: IdentityShape;
  audience: AudienceShape;
  offer: OfferShape;
  isSignedIn: boolean;
}) {
  const [id, setId] = useState<IdentityShape>(identity);
  const [aud, setAud] = useState<AudienceShape>(audience);
  const [off, setOff] = useState<OfferShape>(offer);

  const idStatus = useDebouncedSave("identity", id, isSignedIn);
  const audStatus = useDebouncedSave("audience", aud, isSignedIn);
  const offStatus = useDebouncedSave("offer", off, isSignedIn);

  const idDone = countFilled(id, 3);
  const audDone = countFilled(aud, 2);
  const offDone = countFilled(off, 2);

  return (
    <div className="brain-section">
      <div className="brain-section-head">
        <div>
          <div className="brain-section-num mono">02 · Context</div>
          <h2>Who, who for, and <em>why</em>.</h2>
        </div>
        <div className="brain-section-meta">Used by every tool</div>
      </div>

      <div className="brain-grid">
        <BrainCard num="01" title="Identity" status={statusLabel(idDone, 3)} saveStatus={idStatus} usedBy={["Profile Optimizer", "Caption Writer", "DM Drafting"]}>
          <Field label="Your name" value={id.name ?? ""} onChange={(v) => setId({ ...id, name: v })} placeholder="Jane Doe" />
          <Field label="Title · role" value={id.title ?? ""} onChange={(v) => setId({ ...id, title: v })} placeholder="Founder · operator · creator" />
          <Field label="One-line bio" value={id.bio ?? ""} onChange={(v) => setId({ ...id, bio: v })} placeholder="I help X do Y so they can Z." />
        </BrainCard>

        <BrainCard num="02" title="Audience" status={statusLabel(audDone, 2)} saveStatus={audStatus} usedBy={["Hook Writer", "Comment Analyzer", "Competitor Gap Finder"]}>
          <Field label="Who you're writing for" value={aud.who ?? ""} onChange={(v) => setAud({ ...aud, who: v })} placeholder="Series A founders selling to mid-market ops teams…" />
          <Field label="What keeps them up at night" value={aud.problems ?? ""} onChange={(v) => setAud({ ...aud, problems: v })} placeholder="The 2–3 problems they actually feel." multiline />
        </BrainCard>

        <BrainCard num="03" title="Offer" status={statusLabel(offDone, 2)} saveStatus={offStatus} usedBy={["CTA Flow Check", "DM Drafting", "Caption Writer"]}>
          <Field label="What you want them to do" value={off.cta ?? ""} onChange={(v) => setOff({ ...off, cta: v })} placeholder="Book a call · buy the course · hire us…" />
          <Field label="What you sell, in one line" value={off.what_you_sell ?? ""} onChange={(v) => setOff({ ...off, what_you_sell: v })} placeholder="A 6-week program for operators stepping into VP roles." />
        </BrainCard>

        <div className="brain-card">
          <div className="brain-card-head">
            <div className="brain-card-title">
              <div className="brain-card-num">04</div>
              <h3>Brand assets</h3>
            </div>
            <div className="brain-card-status">0/2 · Library</div>
          </div>
          <div className="brain-field">
            <label>Brand colors · fonts · logos</label>
            <input type="text" placeholder="Upload below in the library…" readOnly style={{ color: "var(--ink-faint)" }} />
          </div>
          <div className="brain-field">
            <label>Visual references</label>
            <input type="text" placeholder="Brands or accounts you admire (drop in the library)" readOnly style={{ color: "var(--ink-faint)" }} />
          </div>
          <div className="brain-usage">
            <span className="brain-usage-label">Used by</span>
            <span className="brain-chip">Carousel Builder</span>
            <span className="brain-chip">Thumbnail Brief Maker</span>
            <span className="brain-chip brain-chip-more">+ every writer</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function GuardrailsSection({ initial, isSignedIn }: { initial: GuardrailsShape; isSignedIn: boolean }) {
  const [g, setG] = useState<GuardrailsShape>(initial);
  const status = useDebouncedSave("guardrails", g, isSignedIn);

  function patch(key: keyof GuardrailsShape, v: string) {
    setG({ ...g, [key]: v });
  }

  return (
    <div className="brain-section">
      <div className="brain-section-head">
        <div>
          <div className="brain-section-num mono">03 · Guardrails</div>
          <h2>What <em>not</em> to do.</h2>
        </div>
        <div className="brain-section-meta">
          <SaveBadge status={status} /> &nbsp; Enforced by every writer tool
        </div>
      </div>

      <div className="brain-donts">
        <p className="brain-donts-lede">
          The fastest way to sound like you is to tell us how <em>not</em> to
          sound. Every writer tool reads these rules before it generates a
          single word.
        </p>
        <div className="brain-donts-grid">
          <DontField label="Words · phrases to never use" hint="Comma-separated. Be ruthless." value={g.words ?? ""} onChange={(v) => patch("words", v)} placeholder="leverage, synergy, fast-paced world, game-changer, unlock, ecosystem…" />
          <DontField label="Topics · angles to avoid" hint="Things you don't want the AI to wander into." value={g.topics ?? ""} onChange={(v) => patch("topics", v)} placeholder="crypto, politics, my prior employer, hot takes on competitors…" />
          <DontField label="Tone · style to avoid" hint="Voices you don't want to echo." value={g.tone ?? ""} onChange={(v) => patch("tone", v)} placeholder="corporate-speak, hype-bro, lecture mode, hashtag-heavy…" />
          <DontField label="Hook patterns to never use" hint="The openers you're sick of seeing in your feed." value={g.hooks ?? ""} onChange={(v) => patch("hooks", v)} placeholder={"\u201cMost people don\u2019t realize\u2026\u201d, \u201cHere\u2019s a hot take\u2026\u201d, \u201cUnpopular opinion\u2026\u201d"} />
          <DontField label="Claims · promises to never make" hint="Legal, ethical, and reputation guardrails." value={g.claims ?? ""} onChange={(v) => patch("claims", v)} placeholder={"\u201cGuaranteed results.\u201d \u201c10x your revenue overnight.\u201d Anything you wouldn\u2019t say on a sales call."} multiline />
          <DontField label="Formatting · structure rules" hint="Visual + structural patterns to suppress." value={g.formatting ?? ""} onChange={(v) => patch("formatting", v)} placeholder="No emojis. No bullet lists over 5 items. No ALL CAPS." multiline />
        </div>
      </div>
    </div>
  );
}

function LibrarySection({ docs, isSignedIn }: { docs: BrainDoc[]; isSignedIn: boolean }) {
  return (
    <div className="brain-section" style={{ marginBottom: 0 }}>
      <div className="brain-section-head">
        <div>
          <div className="brain-section-num mono">04 · The library</div>
          <h2>Everything <em>else</em>.</h2>
        </div>
        <div className="brain-section-meta">
          {docs.length} document{docs.length === 1 ? "" : "s"} · unlimited
        </div>
      </div>

      <div className="brain-lib-drop">
        <div className="brain-lib-drop-icon">{Icons.upload}</div>
        <div className="brain-lib-drop-title">
          {isSignedIn ? (
            <>Drop files here or <span style={{ color: "var(--accent)" }}>browse</span></>
          ) : (
            <>Sign in to upload files</>
          )}
        </div>
        <div className="brain-lib-drop-sub">
          Brand guides, customer research, transcripts, past posts, screenshots, anything.
        </div>
        <div className="brain-lib-types">PDF · DOCX · TXT · MD · PNG · JPG · Up to 25MB</div>
      </div>

      {docs.length ? (
        <div className="brain-lib-list">
          <div className="brain-lib-row is-head">
            <div />
            <div>Document</div>
            <div>Used by</div>
            <div style={{ textAlign: "right" }}>Size</div>
            <div />
          </div>
          {docs.map((d) => (
            <div key={d.id} className="brain-lib-row">
              <div className="brain-lib-icon">{fileExtBadge(d.filename)}</div>
              <div className="brain-lib-name">
                {d.filename}
                <div className="meta">{relativeDate(d.created_at)}</div>
              </div>
              <div className="brain-lib-uses" />
              <div className="brain-lib-size">{formatBytes(d.size_bytes)}</div>
              <div />
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function BrainCard({
  num,
  title,
  status,
  saveStatus,
  usedBy,
  children,
}: {
  num: string;
  title: string;
  status: string;
  saveStatus: SaveStatus;
  usedBy: string[];
  children: React.ReactNode;
}) {
  return (
    <div className="brain-card">
      <div className="brain-card-head">
        <div className="brain-card-title">
          <div className="brain-card-num">{num}</div>
          <h3>{title}</h3>
        </div>
        <div className={`brain-card-status${status.startsWith("0") ? "" : " done"}`}>{status}</div>
      </div>
      {children}
      <div className="brain-usage">
        <span className="brain-usage-label">Used by</span>
        {usedBy.map((u) => (
          <span key={u} className="brain-chip">{u}</span>
        ))}
        <span style={{ marginLeft: "auto" }}>
          <SaveBadge status={saveStatus} />
        </span>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  multiline,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  multiline?: boolean;
}) {
  return (
    <div className="brain-field">
      <label>{label}</label>
      {multiline ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
      ) : (
        <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
      )}
    </div>
  );
}

function DontField({
  label,
  hint,
  value,
  onChange,
  placeholder,
  multiline,
}: {
  label: string;
  hint: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  multiline?: boolean;
}) {
  return (
    <div className="brain-dont">
      <label>{label}</label>
      {multiline ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
      ) : (
        <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
      )}
      <div className="hint">{hint}</div>
    </div>
  );
}

function SaveBadge({ status }: { status: SaveStatus }) {
  if (status === "idle") return null;
  if (status === "saving") return <span className="brain-save mono">Saving…</span>;
  if (status === "saved") return <span className="brain-save mono is-ok">Saved</span>;
  if (status === "needs_signin") return <span className="brain-save mono is-warn">Sign in to save</span>;
  return <span className="brain-save mono is-err">Save failed</span>;
}

function statusLabel(done: number, total: number) {
  if (done === 0) return `0/${total} · Not started`;
  if (done === total) return `${done}/${total} · Done`;
  return `${done}/${total} · In progress`;
}

function countFilled(obj: Record<string, unknown>, max: number) {
  return Math.min(
    max,
    Object.values(obj).filter((v) => typeof v === "string" && v.trim() !== "").length,
  );
}

function formatBytes(n: number) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${Math.round(n / 1024)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

function fileExtBadge(filename: string) {
  const ext = filename.split(".").pop()?.toUpperCase() ?? "FILE";
  return ext.slice(0, 4);
}

function relativeDate(iso: string) {
  const d = new Date(iso);
  const diff = Date.now() - d.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return "Added today";
  if (days === 1) return "Added 1 day ago";
  if (days < 7) return `Added ${days} days ago`;
  if (days < 30) return `Added ${Math.floor(days / 7)} weeks ago`;
  return `Added ${Math.floor(days / 30)} months ago`;
}
