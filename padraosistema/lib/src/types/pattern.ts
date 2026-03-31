export type PatternStatus = "stable" | "review" | "draft" | "deprecated";

export type Pattern = {
  id: string;
  title: string;
  category: string;
  content: string;
  status: PatternStatus;
  createdAt: string;
  userId: string;
  version: number;
};

export type PatternVersionListItem = {
  id: string;
  version: number;
  title: string;
  createdAt: string;
  createdBy: string;
  authorName: string;
};

export type PatternVersionDetail = {
  id: string;
  version: number;
  title: string;
  category: string;
  content: string;
  status: PatternStatus;
  createdAt: string;
  createdBy: string;
  authorName: string;
};

export type PatternInput = {
  title: string;
  category: string;
  content: string;
  status?: PatternStatus;
};
