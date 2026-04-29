export type ExportRequest = {
  patternIds: string[];
};

export type PatternSummary = {
  category: string;
  id: string;
  status: string;
  title: string;
};

export type ExportHistory = {
  createdAt: string;
  id: string;
  patterns: PatternSummary[];
};

export type PatternCartState = {
  items: string[];
};
