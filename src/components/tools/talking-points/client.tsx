"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Icons } from "@/components/icons";
import { saveBoard } from "./actions";
import type { Bullet, Section } from "./types";

type Props = {
  initialSections: Section[];
  isSignedIn: boolean;
};

type SaveStatus = "idle" | "saving" | "saved" | "error" | "needs_signin";

function uid() {
  // crypto.randomUUID exists in modern browsers + Node 19+
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `id-${Math.random().toString(36).slice(2)}-${Date.now()}`;
}

function newBullet(text = ""): Bullet {
  return { id: uid(), text };
}

function newSection(): Section {
  return {
    id: uid(),
    heading: "",
    bullets: [newBullet()],
    editor_notes: "",
    photos: [],
  };
}

export default function TalkingPointsClient({ initialSections, isSignedIn }: Props) {
  const [sections, setSections] = useState<Section[]>(
    initialSections.length > 0 ? initialSections : [newSection()],
  );
  const [status, setStatus] = useState<SaveStatus>("idle");
  const skipFirstSave = useRef(true);

  // Autosave with a 700ms debounce after the last edit.
  useEffect(() => {
    if (skipFirstSave.current) {
      skipFirstSave.current = false;
      return;
    }
    if (!isSignedIn) {
      setStatus("needs_signin");
      return;
    }
    setStatus("saving");
    const handle = setTimeout(async () => {
      const res = await saveBoard(sections);
      setStatus(res.ok ? "saved" : "error");
    }, 700);
    return () => clearTimeout(handle);
  }, [sections, isSignedIn]);

  // -------------------------- Section ops --------------------------

  const addSection = useCallback(() => {
    setSections((prev) => [...prev, newSection()]);
  }, []);

  const deleteSection = useCallback((id: string) => {
    setSections((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const updateHeading = useCallback((id: string, heading: string) => {
    setSections((prev) => prev.map((s) => (s.id === id ? { ...s, heading } : s)));
  }, []);

  const updateNotes = useCallback((id: string, editor_notes: string) => {
    setSections((prev) => prev.map((s) => (s.id === id ? { ...s, editor_notes } : s)));
  }, []);

  const moveSection = useCallback((id: string, direction: -1 | 1) => {
    setSections((prev) => {
      const i = prev.findIndex((s) => s.id === id);
      if (i < 0) return prev;
      const j = i + direction;
      if (j < 0 || j >= prev.length) return prev;
      const next = prev.slice();
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  }, []);

  // --------------------------- Bullet ops ---------------------------

  const addBullet = useCallback((sectionId: string) => {
    setSections((prev) =>
      prev.map((s) =>
        s.id === sectionId ? { ...s, bullets: [...s.bullets, newBullet()] } : s,
      ),
    );
  }, []);

  const updateBullet = useCallback((sectionId: string, bulletId: string, text: string) => {
    setSections((prev) =>
      prev.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              bullets: s.bullets.map((b) => (b.id === bulletId ? { ...b, text } : b)),
            }
          : s,
      ),
    );
  }, []);

  const deleteBullet = useCallback((sectionId: string, bulletId: string) => {
    setSections((prev) =>
      prev.map((s) =>
        s.id === sectionId
          ? { ...s, bullets: s.bullets.filter((b) => b.id !== bulletId) }
          : s,
      ),
    );
  }, []);

  return (
    <div className="tp">
      <div className="tp-head">
        <div>
          <div className="tp-eyebrow mono">
            <span className="dot" />
            <span>YouTube · Pre-production workspace</span>
          </div>
          <h1>Talking <em>Points</em>.</h1>
          <p>
            Build a video outline as sections of bullets. Reorder until the
            structure works, then copy or download it for the shoot.
          </p>
        </div>
        <div className="tp-status-wrap">
          <SaveBadge status={status} />
        </div>
      </div>

      {!isSignedIn ? (
        <div className="tp-signin-banner">
          <div>
            <strong>You&apos;re editing in preview mode.</strong>
            <p>
              Sign in to save your board, attach reference photos, and pick it
              back up on any device. Free, one click.
            </p>
          </div>
          <Link href="/signin" className="btn-primary">
            Sign in
            {Icons.arrow}
          </Link>
        </div>
      ) : null}

      <div className="tp-board">
        {sections.map((section, idx) => (
          <SectionCard
            key={section.id}
            section={section}
            index={idx}
            total={sections.length}
            onMove={(dir) => moveSection(section.id, dir)}
            onDelete={() => deleteSection(section.id)}
            onUpdateHeading={(v) => updateHeading(section.id, v)}
            onUpdateNotes={(v) => updateNotes(section.id, v)}
            onAddBullet={() => addBullet(section.id)}
            onUpdateBullet={(bid, v) => updateBullet(section.id, bid, v)}
            onDeleteBullet={(bid) => deleteBullet(section.id, bid)}
          />
        ))}

        <button type="button" className="tp-add-section" onClick={addSection}>
          + Add section
        </button>
      </div>
    </div>
  );
}

// ---------------------------- Section card ----------------------------

function SectionCard({
  section,
  index,
  total,
  onMove,
  onDelete,
  onUpdateHeading,
  onUpdateNotes,
  onAddBullet,
  onUpdateBullet,
  onDeleteBullet,
}: {
  section: Section;
  index: number;
  total: number;
  onMove: (dir: -1 | 1) => void;
  onDelete: () => void;
  onUpdateHeading: (v: string) => void;
  onUpdateNotes: (v: string) => void;
  onAddBullet: () => void;
  onUpdateBullet: (id: string, v: string) => void;
  onDeleteBullet: (id: string) => void;
}) {
  return (
    <div className="tp-section">
      <div className="tp-section-head">
        <div className="tp-section-num mono">{String(index + 1).padStart(2, "0")}</div>
        <input
          type="text"
          className="tp-section-heading"
          value={section.heading}
          onChange={(e) => onUpdateHeading(e.target.value)}
          placeholder="Section heading — what is this beat about?"
        />
        <div className="tp-section-controls">
          <button
            type="button"
            className="tp-icon-btn"
            onClick={() => onMove(-1)}
            disabled={index === 0}
            title="Move up"
            aria-label="Move section up"
          >
            ↑
          </button>
          <button
            type="button"
            className="tp-icon-btn"
            onClick={() => onMove(1)}
            disabled={index === total - 1}
            title="Move down"
            aria-label="Move section down"
          >
            ↓
          </button>
          <button
            type="button"
            className="tp-icon-btn tp-icon-danger"
            onClick={onDelete}
            title="Delete section"
            aria-label="Delete section"
          >
            ✕
          </button>
        </div>
      </div>

      <div className="tp-bullets">
        {section.bullets.map((b) => (
          <BulletRow
            key={b.id}
            bullet={b}
            onChange={(v) => onUpdateBullet(b.id, v)}
            onDelete={() => onDeleteBullet(b.id)}
            onBackspaceEmpty={() => onDeleteBullet(b.id)}
          />
        ))}
        <button type="button" className="tp-add-bullet" onClick={onAddBullet}>
          + Add point
        </button>
      </div>

      <div className="tp-notes">
        <label className="mono">Editor notes</label>
        <textarea
          value={section.editor_notes}
          onChange={(e) => onUpdateNotes(e.target.value)}
          placeholder="B-roll cues, graphics, music, anything the editor needs to know about this beat…"
          rows={2}
        />
      </div>

      <div className="tp-photos">
        <div className="tp-photos-stub mono">
          Reference photos · coming in next pass
        </div>
      </div>
    </div>
  );
}

// ---------------------------- Bullet row ----------------------------

function BulletRow({
  bullet,
  onChange,
  onDelete,
  onBackspaceEmpty,
}: {
  bullet: Bullet;
  onChange: (v: string) => void;
  onDelete: () => void;
  onBackspaceEmpty: () => void;
}) {
  return (
    <div className="tp-bullet">
      <div className="tp-bullet-dot" />
      <input
        type="text"
        value={bullet.text}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Backspace" && bullet.text === "") {
            e.preventDefault();
            onBackspaceEmpty();
          }
        }}
        placeholder="Add a talking point…"
      />
      <button
        type="button"
        className="tp-icon-btn tp-bullet-x"
        onClick={onDelete}
        title="Delete point"
        aria-label="Delete point"
      >
        ✕
      </button>
    </div>
  );
}

// ---------------------------- Save badge ----------------------------

function SaveBadge({ status }: { status: SaveStatus }) {
  if (status === "idle") return null;
  const label =
    status === "saving" ? "Saving…" :
    status === "saved" ? "Saved" :
    status === "needs_signin" ? "Sign in to save" :
    "Save failed";
  const cls =
    status === "saved" ? "is-ok" :
    status === "needs_signin" ? "is-warn" :
    status === "error" ? "is-err" : "";
  return <span className={`tp-save mono ${cls}`}>{label}</span>;
}
