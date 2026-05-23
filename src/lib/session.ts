import { cookies } from "next/headers";
import { randomUUID } from "crypto";

const COOKIE = "cct_anon";
const TEN_YEARS = 60 * 60 * 24 * 365 * 10;

/**
 * Read or create an anonymous session id for the current request.
 * Persisted in an httpOnly cookie so the client can't tamper with it.
 */
export async function getOrCreateAnonymousSessionId(): Promise<string> {
  const store = await cookies();
  const existing = store.get(COOKIE)?.value;
  if (existing) return existing;
  const id = randomUUID();
  store.set(COOKIE, id, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: TEN_YEARS,
    path: "/",
  });
  return id;
}

/** Read-only — does not create a new one. */
export async function getAnonymousSessionId(): Promise<string | null> {
  const store = await cookies();
  return store.get(COOKIE)?.value ?? null;
}
