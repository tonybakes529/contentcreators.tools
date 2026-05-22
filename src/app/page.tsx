import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 bg-zinc-50 p-8 font-sans dark:bg-black">
      <div className="flex max-w-2xl flex-col items-center gap-6 text-center">
        <h1 className="text-5xl font-semibold tracking-tight text-black dark:text-zinc-50">
          contentcreators.tools
        </h1>
        <p className="text-lg leading-7 text-zinc-600 dark:text-zinc-400">
          Tools for the modern content creator. Coming soon.
        </p>
        <div className="mt-4 rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
          {user ? `Signed in as ${user.email}` : "Supabase connected — no session"}
        </div>
      </div>
    </main>
  );
}
