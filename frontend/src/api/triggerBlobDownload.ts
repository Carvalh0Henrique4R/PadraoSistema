type Params = {
  blob: Blob;
  filename: string;
};

export const triggerBlobDownload = (params: Params): void => {
  const url = URL.createObjectURL(params.blob);
  const anchor = document.createElement("a");
  anchor.setAttribute("href", url);
  anchor.setAttribute("download", params.filename);
  anchor.click();
  URL.revokeObjectURL(url);
};
