import type { ExportHistory } from "@padraosistema/lib";
import { z } from "zod";
import { apiFetch, apiFetchBlob } from "./client.util";

export const exportHistoryQueryKey = ["exportHistory"] as const;

const patternSummarySchema = z.object({
  category: z.string(),
  id: z.uuid(),
  status: z.string(),
  title: z.string(),
});

const exportHistoryItemSchema = z.object({
  createdAt: z.string(),
  id: z.uuid(),
  patterns: z.array(patternSummarySchema),
});

const exportHistoryListSchema = z.array(exportHistoryItemSchema);

export const fetchExportHistoryList = async (): Promise<ExportHistory[]> => {
  const raw = await apiFetch("/api/export/history");
  return exportHistoryListSchema.parse(raw);
};

export const retryExportHistoryZip = async (historyId: string): Promise<Blob> => {
  return apiFetchBlob("/api/export/retry", {
    body: JSON.stringify({ historyId }),
    method: "POST",
  });
};
