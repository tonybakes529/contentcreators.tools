import type { ReactNode } from "react";
import Rail from "./rail";
import Topbar from "./topbar";

export default function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="app">
      <Rail />
      <div className="main">
        <Topbar />
        <main className="stage">
          <div className="stage-scroll">{children}</div>
        </main>
      </div>
    </div>
  );
}
