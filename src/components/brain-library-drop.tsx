"use client";

import { useRef, useState } from "react";
import { Icons } from "./icons";

export default function BrainLibraryDrop() {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div
      className={`brain-lib-drop${dragging ? " is-drag" : ""}`}
      onClick={() => inputRef.current?.click()}
      onDragEnter={(e) => { e.preventDefault(); setDragging(true); }}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => { e.preventDefault(); setDragging(false); }}
    >
      <div className="brain-lib-drop-icon">{Icons.upload}</div>
      <div className="brain-lib-drop-title">
        Drop files here or <span style={{ color: "var(--accent)" }}>browse</span>
      </div>
      <div className="brain-lib-drop-sub">
        Brand guides, customer research, transcripts, past posts, screenshots, anything.
      </div>
      <div className="brain-lib-types">PDF · DOCX · TXT · MD · PNG · JPG · Up to 25MB</div>
      <input ref={inputRef} type="file" multiple style={{ display: "none" }} />
    </div>
  );
}
