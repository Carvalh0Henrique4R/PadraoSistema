import type { PatternStatus, PatternVersionDetail, PatternVersionListItem } from "@padraosistema/lib";
import { patternStatusSchema } from "~/modules/patterns/patterns.schema";
import type { PatternVersionJoinedRow } from "./patternVersions.repository";

const mapStatus = (value: string): PatternStatus => {
  const parsed = patternStatusSchema.safeParse(value);
  return parsed.success ? parsed.data : "draft";
};

export const mapJoinedRowToVersionListItem = (row: PatternVersionJoinedRow): PatternVersionListItem => ({
  authorName: row.authorName,
  createdAt: row.createdAt.toISOString(),
  createdBy: row.createdBy,
  title: row.title,
  version: row.version,
});

export const mapJoinedRowToVersionDetail = (row: PatternVersionJoinedRow): PatternVersionDetail => ({
  authorName: row.authorName,
  category: row.category,
  content: row.content,
  createdAt: row.createdAt.toISOString(),
  createdBy: row.createdBy,
  status: mapStatus(row.status),
  title: row.title,
  version: row.version,
});
