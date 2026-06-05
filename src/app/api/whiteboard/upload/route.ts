import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

const BUCKET = "whiteboard-images";
const MAX_BYTES = 10 * 1024 * 1024; // 10 MB
const ALLOWED = new Set(["image/png", "image/jpeg", "image/gif", "image/webp", "image/svg+xml"]);
const SIGNED_URL_TTL_SEC = 60 * 60 * 4;

/**
 * Upload an image to the whiteboard-images bucket under {user_id}/{uuid}.{ext}.
 * Returns the storage_path + a signed URL the client can drop straight into <img src>.
 */
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Sign in to upload images." }, { status: 401 });
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid multipart body" }, { status: 400 });
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Missing file field" }, { status: 400 });
  }
  if (!ALLOWED.has(file.type)) {
    return NextResponse.json(
      { error: `Unsupported file type: ${file.type || "unknown"}` },
      { status: 415 },
    );
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: `File too large (${Math.round(file.size / 1024 / 1024)}MB max 10MB).` },
      { status: 413 },
    );
  }

  const ext = (file.name.split(".").pop() || mimeExt(file.type) || "bin").toLowerCase().slice(0, 10);
  const id = crypto.randomUUID();
  const storagePath = `${user.id}/${id}.${ext}`;

  const { error: upErr } = await supabase.storage.from(BUCKET).upload(storagePath, file, {
    contentType: file.type,
    upsert: false,
    cacheControl: "3600",
  });
  if (upErr) {
    return NextResponse.json({ error: `Upload failed: ${upErr.message}` }, { status: 500 });
  }

  // Log a row so we can list / GC later
  await supabase.from("whiteboard_images").insert({
    user_id: user.id,
    storage_path: storagePath,
    filename: file.name || `${id}.${ext}`,
    mime_type: file.type,
    size_bytes: file.size,
  });

  const { data: signed } = await supabase.storage.from(BUCKET).createSignedUrl(storagePath, SIGNED_URL_TTL_SEC);

  return NextResponse.json({
    storage_path: storagePath,
    src: signed?.signedUrl ?? null,
    width: null, // browser-side measure on load
    height: null,
  });
}

function mimeExt(mime: string): string | null {
  switch (mime) {
    case "image/png": return "png";
    case "image/jpeg": return "jpg";
    case "image/gif": return "gif";
    case "image/webp": return "webp";
    case "image/svg+xml": return "svg";
    default: return null;
  }
}
