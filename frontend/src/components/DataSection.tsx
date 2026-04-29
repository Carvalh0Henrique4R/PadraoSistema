import { helloExample } from "../api/hello.example";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "~/hooks/useSession";
import type { ReactNode } from "react";

export const DataSection = (): ReactNode => {
  const { data, error, isLoading } = useQuery({
    queryFn: helloExample,
    queryKey: ["helloWorld"],
  });
  const { data: session } = useSession();

  if (isLoading) {
    return (
      <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-slate-400 dark:border-white" />
    );
  }

  if (error != null) {
    return (
      <div className="flex flex-col gap-2 bg-red-500/10 border border-red-500/50 rounded-lg p-2 max-w-md">
        <span className="font-semibold text-red-600 dark:text-red-400">Error loading data</span>
        <span className="p-2 text-sm text-red-700 dark:text-red-300">{error.message}</span>
      </div>
    );
  }

  if (data != null && session?.user == null) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white/90 p-6 backdrop-blur-sm dark:border-white/20 dark:bg-white/10">
        <span className="text-lg text-slate-900 dark:text-white">{data.message}</span>
      </div>
    );
  }

  return null;
};
