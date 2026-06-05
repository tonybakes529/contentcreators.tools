import type { SupabaseClient } from "@supabase/supabase-js";

const BUCKET = "whiteboard-images";
const SIGNED_URL_TTL_SEC = 60 * 60 * 4; // 4 hours

/**
 * Replace every image node's `storage_path` with a freshly signed URL
 * exposed as `src` (which is what the whiteboard's <img> tag reads).
 * Storage path stays alongside so the client can echo it back on save.
 */
export async function signImageUrlsInBoardState(
  supabase: SupabaseClient,
  state: { nodes?: Array<Record<string, unknown>> } & Record<string, unknown>,
): Promise<typeof state> {
  const nodes = Array.isArray(state.nodes) ? state.nodes : [];

  const imagePaths = Array.from(
    new Set(
      nodes
        .filter((n) => n && (n as { type?: string }).type === "image")
        .map((n) => (n as { storage_path?: unknown }).storage_path)
        .filter((p): p is string => typeof p === "string" && p.length > 0),
    ),
  );

  if (imagePaths.length === 0) return state;

  // Sign in one batch where supported; fall back to per-path otherwise.
  const pathToUrl = new Map<string, string>();
  const bucket = supabase.storage.from(BUCKET);
  const batchFn = (bucket as unknown as { createSignedUrls?: (paths: string[], ttl: number) => Promise<{ data: Array<{ path: string | null; signedUrl: string | null }> | null }> }).createSignedUrls;
  const batch = batchFn ? await batchFn.call(bucket, imagePaths, SIGNED_URL_TTL_SEC) : null;
  if (batch && Array.isArray(batch.data)) {
    batch.data.forEach((row: { path?: string | null; signedUrl?: string | null }) => {
      if (row?.path && row?.signedUrl) pathToUrl.set(row.path, row.signedUrl);
    });
  } else {
    await Promise.all(
      imagePaths.map(async (path) => {
        const { data } = await supabase.storage.from(BUCKET).createSignedUrl(path, SIGNED_URL_TTL_SEC);
        if (data?.signedUrl) pathToUrl.set(path, data.signedUrl);
      }),
    );
  }

  return {
    ...state,
    nodes: nodes.map((n) => {
      if (!n || (n as { type?: string }).type !== "image") return n;
      const path = (n as { storage_path?: unknown }).storage_path;
      if (typeof path !== "string") return n;
      const url = pathToUrl.get(path);
      return url ? { ...n, src: url } : n;
    }),
  };
}
