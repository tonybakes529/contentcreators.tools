import type { Metadata } from "next";
import { Icons } from "@/components/icons";
import BrainVoiceEditor from "@/components/brain-voice-editor";
import BrainLibraryDrop from "@/components/brain-library-drop";

export const metadata: Metadata = {
  title: "Your Brain — the knowledge base that powers every tool",
  description:
    "Drop in your voice, audience, offer, and past work. Every tool on contentcreators.tools reads from this — the more it knows, the more your output sounds like you.",
  alternates: { canonical: "/brain" },
};

export default function BrainPage() {
  return (
    <div className="brain">
      <div className="brain-head">
        <div className="brain-eyebrow mono">
          <span className="dot" />
          <span>The knowledge base that powers every tool</span>
        </div>
        <h1>Your <em>brain</em>.</h1>
        <p>
          Drop in your voice, your audience, your offer, your past work. Every
          tool reads from this — the more it knows, the more your output sounds
          like you, not generic AI.
        </p>
        <div className="brain-progress">
          <div>
            <div className="brain-progress-stat">4<span>/10</span></div>
            <div className="brain-progress-label">Complete</div>
          </div>
          <div className="brain-progress-bar"><div style={{ width: "40%" }} /></div>
          <div style={{ textAlign: "right" }}>
            <div className="brain-progress-stat" style={{ fontSize: 20 }}>3<span> / 20</span></div>
            <div className="brain-progress-label">Tools ready</div>
          </div>
        </div>
      </div>

      {/* 01 · Voice */}
      <div className="brain-section">
        <div className="brain-section-head">
          <div>
            <div className="brain-section-num mono">01 · The centerpiece</div>
            <h2>Your <em>voice</em>.</h2>
          </div>
          <div className="brain-section-meta">Used by 8 tools</div>
        </div>

        <div className="brain-voice">
          <div className="brain-voice-l">
            <h3>The single biggest <em>accuracy</em> unlock.</h3>
            <p>
              Paste 3–5 of your best posts, drop a transcript, or upload a brand
              guide. Every tool learns from this — hooks, captions, carousels,
              LinkedIn posts, scripts. Without it you get generic. With it you
              get you.
            </p>
            <ul>
              <li>Use real posts, not your &ldquo;professional&rdquo; ones.</li>
              <li>More ≠ better. 3 great samples beat 20 mediocre ones.</li>
              <li>Include the casual ones — that&apos;s where your voice lives.</li>
            </ul>
            <div className="brain-usage">
              <span className="brain-usage-label">Used by</span>
              <span className="brain-chip">Carousel Builder</span>
              <span className="brain-chip">Caption Writer</span>
              <span className="brain-chip">LinkedIn Post Checker</span>
              <span className="brain-chip">Hook Writer</span>
              <span className="brain-chip brain-chip-more">+ 4 more</span>
            </div>
          </div>
          <BrainVoiceEditor />
        </div>
      </div>

      {/* 02 · Context */}
      <div className="brain-section">
        <div className="brain-section-head">
          <div>
            <div className="brain-section-num mono">02 · Context</div>
            <h2>Who, who for, and <em>why</em>.</h2>
          </div>
          <div className="brain-section-meta">Used by every tool</div>
        </div>

        <div className="brain-grid">
          <div className="brain-card">
            <div className="brain-card-head">
              <div className="brain-card-title">
                <div className="brain-card-num">01</div>
                <h3>Identity</h3>
              </div>
              <div className="brain-card-status done">3/4 · Almost</div>
            </div>
            <div className="brain-field">
              <label>Your name</label>
              <input type="text" placeholder="Jane Doe" />
            </div>
            <div className="brain-field">
              <label>Title · role</label>
              <input type="text" placeholder="Founder · operator · creator" />
            </div>
            <div className="brain-field">
              <label>One-line bio</label>
              <input type="text" placeholder="I help X do Y so they can Z." />
            </div>
            <div className="brain-usage">
              <span className="brain-usage-label">Used by</span>
              <span className="brain-chip">Profile Optimizer</span>
              <span className="brain-chip">Caption Writer</span>
              <span className="brain-chip">DM Drafting</span>
            </div>
          </div>

          <div className="brain-card">
            <div className="brain-card-head">
              <div className="brain-card-title">
                <div className="brain-card-num">02</div>
                <h3>Audience</h3>
              </div>
              <div className="brain-card-status">0/2 · Not started</div>
            </div>
            <div className="brain-field">
              <label>Who you&apos;re writing for</label>
              <input type="text" placeholder="Series A founders selling to mid-market ops teams…" />
            </div>
            <div className="brain-field">
              <label>What keeps them up at night</label>
              <textarea placeholder="The 2–3 problems they actually feel." />
            </div>
            <div className="brain-usage">
              <span className="brain-usage-label">Used by</span>
              <span className="brain-chip">Hook Writer</span>
              <span className="brain-chip">Comment Analyzer</span>
              <span className="brain-chip">Competitor Gap Finder</span>
            </div>
          </div>

          <div className="brain-card">
            <div className="brain-card-head">
              <div className="brain-card-title">
                <div className="brain-card-num">03</div>
                <h3>Offer</h3>
              </div>
              <div className="brain-card-status">0/2 · Not started</div>
            </div>
            <div className="brain-field">
              <label>What you want them to do</label>
              <input type="text" placeholder="Book a call · buy the course · hire us…" />
            </div>
            <div className="brain-field">
              <label>What you sell, in one line</label>
              <input type="text" placeholder="A 6-week program for operators stepping into VP roles." />
            </div>
            <div className="brain-usage">
              <span className="brain-usage-label">Used by</span>
              <span className="brain-chip">CTA Flow Check</span>
              <span className="brain-chip">DM Drafting</span>
              <span className="brain-chip">Caption Writer</span>
            </div>
          </div>

          <div className="brain-card">
            <div className="brain-card-head">
              <div className="brain-card-title">
                <div className="brain-card-num">04</div>
                <h3>Brand assets</h3>
              </div>
              <div className="brain-card-status done">1/2 · Halfway</div>
            </div>
            <div className="brain-field">
              <label>Brand colors · fonts · logos</label>
              <input type="text" placeholder="Upload below in the library…" readOnly style={{ color: "var(--ink-faint)" }} />
            </div>
            <div className="brain-field">
              <label>Visual references</label>
              <input type="text" placeholder="Brands or accounts you admire…" />
            </div>
            <div className="brain-usage">
              <span className="brain-usage-label">Used by</span>
              <span className="brain-chip">Carousel Builder</span>
              <span className="brain-chip">Thumbnail Brief Maker</span>
              <span className="brain-chip">Every writer tool</span>
            </div>
          </div>
        </div>
      </div>

      {/* 03 · Guardrails */}
      <div className="brain-section">
        <div className="brain-section-head">
          <div>
            <div className="brain-section-num mono">03 · Guardrails</div>
            <h2>What <em>not</em> to do.</h2>
          </div>
          <div className="brain-section-meta">Enforced by every writer tool</div>
        </div>

        <div className="brain-donts">
          <p className="brain-donts-lede">
            The fastest way to sound like you is to tell us how <em>not</em> to
            sound. Every writer tool reads these rules before it generates a
            single word.
          </p>
          <div className="brain-donts-grid">
            <div className="brain-dont">
              <label>Words · phrases to never use</label>
              <input type="text" placeholder="leverage, synergy, fast-paced world, game-changer, unlock, ecosystem…" />
              <div className="hint">Comma-separated. Be ruthless.</div>
            </div>
            <div className="brain-dont">
              <label>Topics · angles to avoid</label>
              <input type="text" placeholder="crypto, politics, my prior employer, hot takes on competitors…" />
              <div className="hint">Things you don&apos;t want the AI to wander into.</div>
            </div>
            <div className="brain-dont">
              <label>Tone · style to avoid</label>
              <input type="text" placeholder="corporate-speak, hype-bro, lecture mode, hashtag-heavy…" />
              <div className="hint">Voices you don&apos;t want to echo.</div>
            </div>
            <div className="brain-dont">
              <label>Hook patterns to never use</label>
              <input type="text" placeholder={"\u201cMost people don\u2019t realize\u2026\u201d, \u201cHere\u2019s a hot take\u2026\u201d, \u201cUnpopular opinion\u2026\u201d"} />
              <div className="hint">The openers you&apos;re sick of seeing in your feed.</div>
            </div>
            <div className="brain-dont">
              <label>Claims · promises to never make</label>
              <textarea placeholder={"\u201cGuaranteed results.\u201d \u201c10x your revenue overnight.\u201d Anything you wouldn\u2019t say on a sales call."} />
              <div className="hint">Legal, ethical, and reputation guardrails.</div>
            </div>
            <div className="brain-dont">
              <label>Formatting · structure rules</label>
              <textarea placeholder="No emojis. No bullet lists over 5 items. No ALL CAPS. No —em dashes— (use commas)." />
              <div className="hint">Visual + structural patterns to suppress.</div>
            </div>
          </div>
          <div className="brain-usage">
            <span className="brain-usage-label">Enforced by</span>
            <span className="brain-chip">Carousel Builder</span>
            <span className="brain-chip">Caption Writer</span>
            <span className="brain-chip">Hook Writer</span>
            <span className="brain-chip">LinkedIn Post Checker</span>
            <span className="brain-chip">DM Drafting</span>
            <span className="brain-chip">Script Analyzer</span>
            <span className="brain-chip brain-chip-more">+ every writer tool</span>
          </div>
        </div>
      </div>

      {/* 04 · Library */}
      <div className="brain-section" style={{ marginBottom: 0 }}>
        <div className="brain-section-head">
          <div>
            <div className="brain-section-num mono">04 · The library</div>
            <h2>Everything <em>else</em>.</h2>
          </div>
          <div className="brain-section-meta">3 documents · unlimited</div>
        </div>

        <BrainLibraryDrop />

        <div className="brain-lib-list">
          <div className="brain-lib-row is-head">
            <div />
            <div>Document</div>
            <div>Used by</div>
            <div style={{ textAlign: "right" }}>Size</div>
            <div />
          </div>
          <LibraryRow icon="PDF" name="Brand_Guide_v3.pdf" meta="Added 3 days ago · 12 pages" chips={["Carousel Builder", "Thumbnail Brief"]} more="+ 2" size="1.8 MB" />
          <LibraryRow icon="MD" name="ICP_research_Q3.md" meta="Added 1 week ago · 4,200 words" chips={["Hook Writer", "Comment Analyzer"]} more="+ 3" size="42 KB" />
          <LibraryRow icon="TXT" name="Podcast_ep41_transcript.txt" meta="Added 2 weeks ago · 58 min episode" chips={["Voice training", "Long Form to LinkedIn"]} size="88 KB" />
        </div>
      </div>
    </div>
  );
}

function LibraryRow({
  icon,
  name,
  meta,
  chips,
  more,
  size,
}: {
  icon: string;
  name: string;
  meta: string;
  chips: string[];
  more?: string;
  size: string;
}) {
  return (
    <div className="brain-lib-row">
      <div className="brain-lib-icon">{icon}</div>
      <div className="brain-lib-name">
        {name}
        <div className="meta">{meta}</div>
      </div>
      <div className="brain-lib-uses">
        {chips.map((c) => (
          <span key={c} className="brain-chip">{c}</span>
        ))}
        {more ? <span className="brain-chip brain-chip-more">{more}</span> : null}
      </div>
      <div className="brain-lib-size">{size}</div>
      <button className="brain-lib-remove" type="button" aria-label="Remove">
        {Icons.close}
      </button>
    </div>
  );
}

