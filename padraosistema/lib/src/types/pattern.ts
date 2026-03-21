export type PatternStatus = "stable" | "review" | "draft" | "deprecated";

export type Pattern = {
  id: string;
  title: string;
  category: string;
  content: string;
  status: PatternStatus;
  createdAt: string;
};

export type PatternInput = {
  title: string;
  category: string;
  content: string;
  status?: PatternStatus;
};
