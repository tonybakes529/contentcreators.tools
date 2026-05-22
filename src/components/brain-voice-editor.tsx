"use client";

import { useState } from "react";
import { Icons } from "./icons";

type Tab = "paste" | "upload" | "link";

export default function BrainVoiceEditor() {
  const [tab, setTab] = useState<Tab>("paste");
  const [text, setText] = useState("");
  const [saved, setSaved] = useState(false);

  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const samples = text.trim() ? text.trim().split(/\n\s*\n/).filter(Boolean).length : 0;

  return (
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
          "Paste 3–5 of your best posts here. Separate each one with a blank line.\n\n— Post 1 —\n\nA founder told me they couldn't afford to slow down. Eight months later they sold the company for parts. Speed isn't a strategy. It's a tax you pay on bad decisions.\n\n— Post 2 —\n\n..."
        }
      />
      <div className="brain-voice-foot">
        <div className="brain-voice-count">
          <strong>{samples}</strong> sample{samples === 1 ? "" : "s"} · {words.toLocaleString()} word{words === 1 ? "" : "s"}
        </div>
        <button
          className="btn-primary"
          type="button"
          onClick={() => {
            setSaved(true);
            setTimeout(() => setSaved(false), 1800);
          }}
        >
          {saved ? "Saved ✓" : (
            <>
              Save voice
              {Icons.arrow}
            </>
          )}
        </button>
      </div>
    </div>
  );
}
