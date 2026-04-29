import type { UseQueryResult } from "@tanstack/react-query";

export type HistoryQueryDisplayState = "error" | "loading" | "ready";

export const queryResultToHistoryDisplayState = (q: UseQueryResult<unknown>): HistoryQueryDisplayState => {
  if (q.isLoading) {
    return "loading";
  }
  if (q.isError) {
    return "error";
  }
  return "ready";
};
