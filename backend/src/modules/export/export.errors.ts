export class ExportPatternsInvalidSelectionError extends Error {
  override readonly name = "ExportPatternsInvalidSelectionError";

  constructor() {
    super("Lista de padrões inválida");
  }
}
