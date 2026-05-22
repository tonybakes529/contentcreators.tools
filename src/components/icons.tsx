import type { ReactNode } from "react";

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export const Icons: Record<string, ReactNode> = {
  home: (
    <svg viewBox="0 0 24 24" {...stroke}>
      <path d="M3 11L12 4l9 7v9a1 1 0 0 1-1 1h-5v-7H10v7H5a1 1 0 0 1-1-1V11z" />
    </svg>
  ),
  brain: (
    <svg viewBox="0 0 24 24" {...stroke}>
      <path d="M9 4a3 3 0 0 0-3 3 3 3 0 0 0-2 5 3 3 0 0 0 0 4 3 3 0 0 0 2 5 3 3 0 0 0 3 3h0a3 3 0 0 0 3-3V4a3 3 0 0 0-3 0z" />
      <path d="M15 4a3 3 0 0 1 3 3 3 3 0 0 1 2 5 3 3 0 0 1 0 4 3 3 0 0 1-2 5 3 3 0 0 1-3 3h0a3 3 0 0 1-3-3V4a3 3 0 0 1 3 0z" />
    </svg>
  ),
  all: (
    <svg viewBox="0 0 24 24" {...stroke}>
      <rect x="4" y="4" width="7" height="7" rx="1.5" />
      <rect x="13" y="4" width="7" height="7" rx="1.5" />
      <rect x="4" y="13" width="7" height="7" rx="1.5" />
      <rect x="13" y="13" width="7" height="7" rx="1.5" />
    </svg>
  ),
  youtube: (
    <svg viewBox="0 0 24 24" {...stroke}>
      <rect x="2.5" y="6" width="19" height="12" rx="3" />
      <path d="M10 9.5l5 2.5-5 2.5z" fill="currentColor" stroke="none" />
    </svg>
  ),
  "instagram-tiktok": (
    <svg viewBox="0 0 24 24" {...stroke}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17" cy="7" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  ),
  linkedin: (
    <svg viewBox="0 0 24 24" {...stroke}>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <circle cx="8" cy="9" r="0.6" fill="currentColor" />
      <path d="M8 11.5v6" />
      <path d="M12 17.5v-6" />
      <path d="M12 14a2.5 2.5 0 0 1 5 0v3.5" />
    </svg>
  ),
  brand: (
    <svg viewBox="0 0 24 24" {...stroke}>
      <path d="M5 21V5a2 2 0 0 1 2-2h7l5 5v13a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2z" />
      <path d="M14 3v5h5" />
      <circle cx="10" cy="14" r="2" />
    </svg>
  ),
  management: (
    <svg viewBox="0 0 24 24" {...stroke}>
      <path d="M4 6h16M4 12h16M4 18h10" />
    </svg>
  ),
  calculators: (
    <svg viewBox="0 0 24 24" {...stroke}>
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <rect x="8" y="6" width="8" height="3" rx="0.5" />
      <circle cx="9" cy="13" r="0.6" fill="currentColor" />
      <circle cx="12" cy="13" r="0.6" fill="currentColor" />
      <circle cx="15" cy="13" r="0.6" fill="currentColor" />
    </svg>
  ),
  ideation: (
    <svg viewBox="0 0 24 24" {...stroke}>
      <path d="M9 21h6M10 18h4M12 3a6 6 0 0 0-3.5 10.9c.5.5.9 1.2.9 2.1h5.2c0-.9.4-1.6.9-2.1A6 6 0 0 0 12 3z" />
    </svg>
  ),
  arrow: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M3 8h10M9 4l4 4-4 4" />
    </svg>
  ),
  search: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={2}>
      <circle cx="7" cy="7" r="5" />
      <path d="M11 11l3 3" />
    </svg>
  ),
  upload: (
    <svg viewBox="0 0 24 24" {...stroke}>
      <path d="M12 3v12M7 8l5-5 5 5M5 21h14" />
    </svg>
  ),
  close: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round">
      <path d="M3 3 L13 13 M13 3 L3 13" />
    </svg>
  ),
};
