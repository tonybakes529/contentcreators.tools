import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import TopbarSearch from "./topbar-search";
import UserMenu from "./user-menu";

export default async function Topbar() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <header className="topbar">
      <div className="topbar-l">
        <Link href="/" className="topbar-brand">
          contentcreators<span>.tools</span>
        </Link>
      </div>
      <div className="topbar-r">
        <TopbarSearch />
        {user ? (
          <UserMenu email={user.email ?? "(no email)"} />
        ) : (
          <Link href="/signin" className="btn-ghost topbar-signin">Sign in</Link>
        )}
      </div>
    </header>
  );
}
