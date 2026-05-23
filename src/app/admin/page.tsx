import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Icons } from "@/components/icons";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

type ToolRow = {
  slug: string;
  name: string;
  category_slug: string;
  template: string;
  model: string;
  enabled: boolean;
  updated_at: string;
};

type RunRow = {
  id: string;
  tool_slug: string;
  user_id: string | null;
  anonymous_session_id: string | null;
  status: string;
  tokens_in: number | null;
  tokens_out: number | null;
  latency_ms: number | null;
  error: string | null;
  created_at: string;
};

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/signin?next=/admin");

  const { data: adminCheck } = await supabase.rpc("is_admin");
  if (!adminCheck) notFound();

  const [{ data: tools }, { data: runs }, { data: usage }] = await Promise.all([
    supabase
      .from("tools")
      .select("slug, name, category_slug, template, model, enabled, updated_at")
      .order("category_slug", { ascending: true })
      .order("name", { ascending: true }),
    supabase
      .from("runs")
      .select("id, tool_slug, user_id, anonymous_session_id, status, tokens_in, tokens_out, latency_ms, error, created_at")
      .order("created_at", { ascending: false })
      .limit(100),
    supabase
      .from("runs")
      .select("tool_slug, status, tokens_in, tokens_out", { count: "exact" }),
  ]);

  const toolsList = (tools as ToolRow[]) ?? [];
  const runsList = (runs as RunRow[]) ?? [];
  const usageRows = (usage as { tool_slug: string; status: string; tokens_in: number | null; tokens_out: number | null }[]) ?? [];

  const summary = usageRows.reduce(
    (acc, r) => {
      acc.total += 1;
      if (r.status === "success") acc.success += 1;
      if (r.status === "error") acc.error += 1;
      acc.tokensIn += r.tokens_in ?? 0;
      acc.tokensOut += r.tokens_out ?? 0;
      return acc;
    },
    { total: 0, success: 0, error: 0, tokensIn: 0, tokensOut: 0 },
  );

  return (
    <div className="admin">
      <div className="admin-head">
        <div className="admin-eyebrow mono">
          <span className="dot" />
          <span>Admin · {user.email}</span>
        </div>
        <h1>Operate <em>the system</em>.</h1>
        <p>Iterate prompts, watch usage, catch broken tools.</p>
      </div>

      <div className="admin-stats">
        <Stat label="Tools" value={toolsList.length.toString()} />
        <Stat label="Live" value={toolsList.filter((t) => t.enabled).length.toString()} />
        <Stat label="Runs (all-time)" value={summary.total.toString()} />
        <Stat label="Success" value={`${summary.total ? Math.round((summary.success / summary.total) * 100) : 0}%`} />
        <Stat label="Tokens in" value={summary.tokensIn.toLocaleString()} />
        <Stat label="Tokens out" value={summary.tokensOut.toLocaleString()} />
      </div>

      <section className="admin-section">
        <div className="admin-section-head">
          <h2>Tools</h2>
          <div className="admin-section-meta mono">{toolsList.length} total</div>
        </div>
        <div className="admin-table">
          <div className="admin-table-row is-head">
            <div>Slug</div>
            <div>Name</div>
            <div>Category</div>
            <div>Template</div>
            <div>Model</div>
            <div style={{ textAlign: "right" }}>Updated</div>
            <div />
          </div>
          {toolsList.map((t) => (
            <div key={t.slug} className="admin-table-row">
              <div className="mono">{t.slug}</div>
              <div>{t.name}</div>
              <div className="mono">{t.category_slug}</div>
              <div className="mono">{t.template}</div>
              <div className="mono">{t.model}</div>
              <div className="mono" style={{ textAlign: "right", color: "var(--ink-dim)" }}>{relative(t.updated_at)}</div>
              <div style={{ textAlign: "right" }}>
                <Link href={`/admin/tools/${t.slug}`} className="admin-link">Edit {Icons.arrow}</Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="admin-section">
        <div className="admin-section-head">
          <h2>Recent runs</h2>
          <div className="admin-section-meta mono">last {runsList.length}</div>
        </div>
        <div className="admin-table">
          <div className="admin-table-row is-head admin-runs-row">
            <div>When</div>
            <div>Tool</div>
            <div>Caller</div>
            <div style={{ textAlign: "right" }}>Tokens</div>
            <div style={{ textAlign: "right" }}>Latency</div>
            <div>Status</div>
          </div>
          {runsList.length === 0 ? (
            <div className="admin-empty">No runs yet.</div>
          ) : (
            runsList.map((r) => (
              <div key={r.id} className="admin-table-row admin-runs-row">
                <div className="mono">{relative(r.created_at)}</div>
                <div>{r.tool_slug}</div>
                <div className="mono" style={{ color: "var(--ink-dim)" }}>
                  {r.user_id ? "user" : "anon"} · {(r.user_id ?? r.anonymous_session_id ?? "").slice(0, 8)}
                </div>
                <div className="mono" style={{ textAlign: "right" }}>
                  {(r.tokens_in ?? 0) + (r.tokens_out ?? 0)}
                </div>
                <div className="mono" style={{ textAlign: "right" }}>{r.latency_ms ?? "—"} ms</div>
                <div className={`mono admin-status admin-status-${r.status}`}>{r.status}</div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="admin-stat">
      <div className="admin-stat-value">{value}</div>
      <div className="admin-stat-label mono">{label}</div>
    </div>
  );
}

function relative(iso: string) {
  const d = new Date(iso);
  const diff = Date.now() - d.getTime();
  const s = Math.floor(diff / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const days = Math.floor(h / 24);
  return `${days}d ago`;
}
