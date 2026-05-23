"use client";

import { useState, useRef, useEffect } from "react";

export default function UserMenu({ email }: { email: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onDocClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  const initial = email[0]?.toUpperCase() ?? "?";

  return (
    <div className="user-menu" ref={ref}>
      <button
        type="button"
        className="user-menu-btn"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="true"
        aria-expanded={open}
      >
        <span className="user-menu-avatar">{initial}</span>
      </button>
      {open ? (
        <div className="user-menu-dropdown">
          <div className="user-menu-email">{email}</div>
          <form action="/auth/signout" method="post">
            <button type="submit" className="user-menu-item">Sign out</button>
          </form>
        </div>
      ) : null}
    </div>
  );
}
