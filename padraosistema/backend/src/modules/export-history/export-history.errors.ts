export class ExportHistoryNotFoundError extends Error {
  public constructor() {
    super("Export history not found");
    this.name = "ExportHistoryNotFoundError";
  }
}
