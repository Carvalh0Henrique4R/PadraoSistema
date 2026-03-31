import type { EnvIssue } from "../env/validate";
import type { ReactNode } from "react";
import { IssueRow } from "./IssueRow";

export const EnvError = ({ issues }: { issues: EnvIssue[] }): ReactNode => {
  return (
    <div className="flex min-h-screen flex-col gap-4 bg-zinc-100 p-12 font-mono text-sm text-zinc-900 dark:bg-zinc-900 dark:text-neutral-200">
      <h1 className="text-xl font-bold text-red-600 dark:text-red-400">Invalid Environment Variables</h1>
      <p className="text-zinc-600 dark:text-neutral-400">
        The following environment variables are missing or invalid. Check your <code>frontend/.env</code> file.
      </p>
      <ul className="flex flex-col gap-2 list-none m-0 p-0">
        {issues.map((issue) => (
          <IssueRow issue={issue} key={issue.path} />
        ))}
      </ul>
    </div>
  );
};
