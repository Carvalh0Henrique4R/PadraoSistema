import { apiFetchBlob } from "./client.util";

export const exportPatternsZip = async (patternIds: string[]): Promise<Blob> => {
  return apiFetchBlob("/api/export", {
    body: JSON.stringify({ patternIds }),
    method: "POST",
  });
};
