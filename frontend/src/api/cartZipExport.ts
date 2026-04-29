import { tryCatchAsync } from "@padraosistema/lib";
import { exportPatternsZip } from "./patternExport";
import { triggerBlobDownload } from "./triggerBlobDownload";

type Params = {
  itemIds: string[];
  onAfterSuccess: () => void;
};

export const runCartZipExport = async (params: Params): Promise<string | null> => {
  const [blob, err] = await tryCatchAsync(() => exportPatternsZip(params.itemIds));
  if (err != null) {
    return err.message;
  }
  triggerBlobDownload({ blob, filename: "patterns.zip" });
  params.onAfterSuccess();
  return null;
};
