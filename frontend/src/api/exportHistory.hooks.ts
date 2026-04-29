import type { ExportHistory } from "@padraosistema/lib";
import { tryCatchAsync } from "@padraosistema/lib";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { exportHistoryQueryKey, fetchExportHistoryList, retryExportHistoryZip } from "./exportHistory";
import { triggerBlobDownload } from "./triggerBlobDownload";

export const useExportHistoryQuery = () => {
  return useQuery<ExportHistory[], Error>({
    queryFn: fetchExportHistoryList,
    queryKey: exportHistoryQueryKey,
  });
};

type UseRetryExportFromHistoryResult = {
  retryError: string | null;
  retryExport: (historyId: string) => void;
};

export const useRetryExportFromHistory = (): UseRetryExportFromHistoryResult => {
  const queryClient = useQueryClient();
  const [retryError, setRetryError] = React.useState<string | null>(null);

  const retryExport = React.useCallback(
    (historyId: string): void => {
      setRetryError(null);
      const run = async (): Promise<void> => {
        const [blob, err] = await tryCatchAsync(() => retryExportHistoryZip(historyId));
        if (err != null) {
          setRetryError(err.message);
          return;
        }
        triggerBlobDownload({ blob, filename: "patterns.zip" });
        await queryClient.invalidateQueries({ queryKey: exportHistoryQueryKey });
      };
      void run();
    },
    [queryClient],
  );

  return { retryError, retryExport };
};
