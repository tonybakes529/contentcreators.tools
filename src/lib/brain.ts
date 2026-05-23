import { createClient } from "@/lib/supabase/server";

export type Brain = {
  voice_samples: string;
  audience: Record<string, unknown>;
  guardrails: Record<string, unknown>;
  identity: Record<string, unknown>;
  offer: Record<string, unknown>;
};

const EMPTY_BRAIN: Brain = {
  voice_samples: "",
  audience: {},
  guardrails: {},
  identity: {},
  offer: {},
};

/** Load the current user's Brain. Returns an empty Brain for anonymous users. */
export async function loadBrain(): Promise<{ brain: Brain; isSignedIn: boolean }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { brain: EMPTY_BRAIN, isSignedIn: false };

  const { data } = await supabase
    .from("brains")
    .select("voice_samples, audience, guardrails, identity, offer")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!data) return { brain: EMPTY_BRAIN, isSignedIn: true };
  return {
    brain: {
      voice_samples: data.voice_samples ?? "",
      audience: (data.audience as Record<string, unknown>) ?? {},
      guardrails: (data.guardrails as Record<string, unknown>) ?? {},
      identity: (data.identity as Record<string, unknown>) ?? {},
      offer: (data.offer as Record<string, unknown>) ?? {},
    },
    isSignedIn: true,
  };
}

/**
 * Substitute `{{key}}` placeholders in a prompt template with values from the
 * caller's inputs and Brain. Brain placeholders fall back to empty strings
 * for anonymous users.
 */
export function renderPrompt(
  template: string,
  inputs: Record<string, unknown>,
  brain: Brain,
): string {
  const flatBrain = {
    voice: brain.voice_samples,
    audience: stringifyMaybe(brain.audience),
    guardrails: stringifyMaybe(brain.guardrails),
    identity: stringifyMaybe(brain.identity),
    offer: stringifyMaybe(brain.offer),
  };

  return template.replace(/\{\{([a-z_]+)\}\}/gi, (_match, key: string) => {
    const k = key.toLowerCase();
    if (k in flatBrain) return (flatBrain as Record<string, string>)[k] || "";
    if (k in inputs) {
      const v = inputs[k];
      return typeof v === "string" ? v : JSON.stringify(v);
    }
    return "";
  });
}

function stringifyMaybe(v: Record<string, unknown>): string {
  const entries = Object.entries(v).filter(([, val]) => val !== "" && val != null);
  if (!entries.length) return "";
  return entries.map(([k, val]) => `${k}: ${typeof val === "string" ? val : JSON.stringify(val)}`).join("\n");
}
