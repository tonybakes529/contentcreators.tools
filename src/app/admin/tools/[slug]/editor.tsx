"use client";

import { useState } from "react";
import { Icons } from "@/components/icons";
import { saveToolConfig } from "./actions";

type Props = {
  slug: string;
  initialPrompt: string;
  initialModel: string;
  initialEnabled: boolean;
  initialInputConfig: string;
};

export default function ToolEditor({
  slug,
  initialPrompt,
  initialModel,
  initialEnabled,
  initialInputConfig,
}: Props) {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [model, setModel] = useState(initialModel);
  const [enabled, setEnabled] = useState(initialEnabled);
  const [inputConfig, setInputConfig] = useState(initialInputConfig);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSave() {
    setStatus("saving");
    setError(null);

    let parsedConfig: unknown;
    try {
      parsedConfig = JSON.parse(inputConfig);
    } catch {
      setStatus("error");
      setError("Input config is not valid JSON.");
      return;
    }

    const res = await saveToolConfig({
      slug,
      prompt_template: prompt,
      model,
      enabled,
      input_config: parsedConfig,
    });

    if (!res.ok) {
      setStatus("error");
      setError(res.error);
      return;
    }
    setStatus("saved");
    setTimeout(() => setStatus("idle"), 2000);
  }

  return (
    <div className="admin-editor">
      <div className="admin-editor-row">
        <label>Model</label>
        <input type="text" value={model} onChange={(e) => setModel(e.target.value)} />
      </div>
      <div className="admin-editor-row">
        <label>Enabled</label>
        <label className="admin-toggle">
          <input type="checkbox" checked={enabled} onChange={(e) => setEnabled(e.target.checked)} />
          <span>{enabled ? "Live" : "Disabled"}</span>
        </label>
      </div>
      <div className="admin-editor-row">
        <label>Prompt template</label>
        <textarea
          className="admin-editor-prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={20}
          spellCheck={false}
        />
        <div className="admin-editor-hint mono">
          Placeholders: <code>&#123;&#123;voice&#125;&#125;</code> <code>&#123;&#123;audience&#125;&#125;</code> <code>&#123;&#123;guardrails&#125;&#125;</code> <code>&#123;&#123;identity&#125;&#125;</code> <code>&#123;&#123;offer&#125;&#125;</code> + any field name from input config
        </div>
      </div>
      <div className="admin-editor-row">
        <label>Input config (JSON)</label>
        <textarea
          className="admin-editor-prompt"
          value={inputConfig}
          onChange={(e) => setInputConfig(e.target.value)}
          rows={8}
          spellCheck={false}
        />
      </div>
      <div className="admin-editor-actions">
        <button type="button" className="btn-primary" onClick={onSave} disabled={status === "saving"}>
          {status === "saving" ? "Saving…" : status === "saved" ? "Saved ✓" : "Save"}
          {status === "idle" ? Icons.arrow : null}
        </button>
        {error ? <div className="admin-editor-error">{error}</div> : null}
      </div>
    </div>
  );
}
