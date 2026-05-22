import Link from "next/link";
import { Icons } from "./icons";

type Props = {
  badge: string;
  /** H1 HTML (must be trusted; we render with dangerouslySetInnerHTML to support <em>) */
  h1Html: string;
  sub: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref?: string;
  secondaryLabel?: string;
};

export default function Hero({
  badge,
  h1Html,
  sub,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
}: Props) {
  return (
    <section className="hero">
      <div className="hero-eyebrow mono">
        <span className="dot" />
        <span>{badge}</span>
      </div>
      <h1 dangerouslySetInnerHTML={{ __html: h1Html }} />
      <p className="hero-sub">{sub}</p>
      <div className="hero-ctas">
        <Link href={primaryHref} className="btn-primary">
          {primaryLabel}
          {Icons.arrow}
        </Link>
        {secondaryHref && secondaryLabel ? (
          <Link href={secondaryHref} className="btn-ghost">
            {secondaryLabel}
          </Link>
        ) : null}
      </div>
    </section>
  );
}
