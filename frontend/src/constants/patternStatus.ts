import type { PatternStatus } from "@padraosistema/lib";

export const PATTERN_STATUS_LABELS: Record<PatternStatus, string> = {
  stable: "Estável",
  review: "Em revisão",
  draft: "Rascunho",
  deprecated: "Depreciado",
};

export const PATTERN_STATUS_ORDER: PatternStatus[] = ["stable", "review", "draft", "deprecated"];
