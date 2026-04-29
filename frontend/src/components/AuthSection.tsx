import { signIn, signOut } from "@hono/auth-js/react";
import { useSession } from "~/hooks/useSession";
import type { ReactNode } from "react";

const handleSignOut = (): void => {
  void signOut();
};

const handleSignIn = (): void => {
  void signIn("google");
};

export const AuthSection = (): ReactNode => {
  const { data: session, status: sessionStatus } = useSession();

  if (sessionStatus === "loading") {
    return (
      <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-slate-400 dark:border-white" />
    );
  }

  if (session?.user != null) {
    return (
      <div className="flex flex-col items-center gap-4 bg-green-500/10 border border-green-500/50 rounded-lg p-6 max-w-md">
        <span className="text-2xl font-bold text-green-700 dark:text-green-400">Hello {session.user.name}!</span>
        <span className="text-sm text-green-800 dark:text-green-300">
          This is a secret message for authenticated users only!
        </span>
        <button
          className="cursor-pointer rounded-lg border border-red-500/50 bg-red-500/15 px-4 py-2 font-semibold text-red-700 transition-colors hover:bg-red-500/25 dark:bg-red-500/20 dark:text-red-300 dark:hover:bg-red-500/30"
          onClick={handleSignOut}
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <button
      className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-300 bg-slate-100 px-6 py-3 font-semibold text-slate-900 transition-colors hover:bg-slate-200 dark:border-white/20 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
      onClick={handleSignIn}
    >
      Sign in
    </button>
  );
};
