import type { Metadata } from "next";
import { Inter, Inter_Tight, JetBrains_Mono, Fraunces } from "next/font/google";
import "./globals.css";
import AppShell from "@/components/app-shell";

const inter = Inter({ variable: "--font-body", subsets: ["latin"], weight: ["400", "500", "600", "700"] });
const interTight = Inter_Tight({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});
const jetbrains = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});
const fraunces = Fraunces({
  variable: "--font-editorial",
  subsets: ["latin"],
  style: ["italic", "normal"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://contentcreators.tools"),
  title: {
    default: "contentcreators.tools — free tools for creators",
    template: "%s · contentcreators.tools",
  },
  description: "A growing kit of free, single-purpose tools for content creators. Pick a category, open a tool, ship something today.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${interTight.variable} ${jetbrains.variable} ${fraunces.variable}`}
    >
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
