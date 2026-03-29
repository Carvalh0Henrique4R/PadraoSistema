export const SYSTEM_LOG_ACTIONS = [
  "CREATE_PATTERN",
  "UPDATE_PATTERN",
  "DELETE_PATTERN",
  "CREATE_VERSION",
  "EXPORT_PATTERNS",
  "REEXPORT_PATTERNS",
  "IMPORT_PATTERNS",
] as const;

export type SystemLogAction = (typeof SYSTEM_LOG_ACTIONS)[number];

export const SYSTEM_LOG_ENTITIES = ["pattern", "export", "import"] as const;

export type SystemLogEntity = (typeof SYSTEM_LOG_ENTITIES)[number];

export type SystemLogMetadataValue = string | number | boolean | null;

export type SystemLogMetadata = Record<string, SystemLogMetadataValue>;
