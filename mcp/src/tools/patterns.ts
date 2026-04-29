import { and, count, desc, eq, sql } from "drizzle-orm";
import { z } from "zod";

import { PATTERN_CATEGORY_SLUGS, tryCatchAsync } from "@padraosistema/lib";

import { db, patternVersions, patterns } from "../db";
import type { McpTool } from "./types";

const patternStatusValues = ["draft", "deprecated", "review", "stable"] as const;

const listPatternsInputSchema = z.object({
  category: z.enum(PATTERN_CATEGORY_SLUGS).optional(),
  limit: z.number().int().min(1).max(200).default(50),
  offset: z.number().int().min(0).default(0),
  status: z.enum(patternStatusValues).optional(),
});

const getPatternInputSchema = z.object({
  id: z.uuid(),
});

const searchPatternsInputSchema = z.object({
  query: z.string().min(2),
});

const getPatternVersionsInputSchema = z.object({
  patternId: z.uuid(),
});

const getPatternStatsInputSchema = z.object({});

const escapePgLikeWildcards = (value: string): string => {
  return value
    .replaceAll("\\", String.raw`\\`)
    .replaceAll("%", String.raw`\%`)
    .replaceAll("_", String.raw`\_`);
};

const serializePatternDates = <
  Row extends {
    createdAt: Date;
    updatedAt: Date;
  },
>(
  row: Row,
): Omit<Row, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
} => {
  return {
    ...row,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
};

export const patternsTools: readonly McpTool[] = [
  {
    description:
      "Lista padrões cadastrados. Filtra opcionalmente por status e/ou categoria. Retorna id, title, content, category e version.",
    handler: async (inputRaw: unknown): Promise<unknown> => {
      const input = listPatternsInputSchema.parse(inputRaw);
      const statusFilter = input.status == null ? [] : [eq(patterns.status, input.status)];
      const categoryFilter = input.category == null ? [] : [eq(patterns.category, input.category)];
      const filters = [...statusFilter, ...categoryFilter];

      const [rows, handlerError] = await tryCatchAsync(async () => {
        const projected = db
          .select({
            category: patterns.category,
            id: patterns.id,
            content: patterns.content,
            title: patterns.title,
            version: patterns.version,
          })
          .from(patterns);

        if (filters.length === 0) {
          return projected.orderBy(desc(patterns.updatedAt)).limit(input.limit).offset(input.offset);
        }

        return projected
          .where(and(...filters))
          .orderBy(desc(patterns.updatedAt))
          .limit(input.limit)
          .offset(input.offset);
      });

      if (handlerError !== null) {
        throw handlerError;
      }

      return rows.map((row) => ({
        category: row.category,
        content: row.content,
        id: row.id,
        title: row.title,
        version: row.version,
      }));
    },
    inputSchema: listPatternsInputSchema,
    name: "list_patterns",
  },
  {
    description: "Retorna um padrão completo por ID, incluindo o conteúdo Markdown.",
    handler: async (inputRaw: unknown): Promise<unknown> => {
      const input = getPatternInputSchema.parse(inputRaw);
      const [rows, fetchError] = await tryCatchAsync(async () =>
        db.select().from(patterns).where(eq(patterns.id, input.id)).limit(1),
      );

      if (fetchError !== null) {
        throw fetchError;
      }

      if (rows.length === 0) {
        return { message: "Padrão não encontrado.", notFound: true };
      }

      return serializePatternDates(rows[0]);
    },
    inputSchema: getPatternInputSchema,
    name: "get_pattern",
  },
  {
    description: "Busca padrões por texto no título ou conteúdo. Retorna até 20 resultados mais relevantes.",
    handler: async (inputRaw: unknown): Promise<unknown> => {
      const input = searchPatternsInputSchema.parse(inputRaw);
      const escapedQuery = escapePgLikeWildcards(input.query);
      const predicate = `%${escapedQuery}%`;
      const [rows, searchError] = await tryCatchAsync(async () =>
        db
          .select({
            category: patterns.category,
            content: patterns.content,
            createdAt: patterns.createdAt,
            id: patterns.id,
            status: patterns.status,
            title: patterns.title,
            updatedAt: patterns.updatedAt,
            version: patterns.version,
          })
          .from(patterns)
          .where(
            sql`(${patterns.title} ILIKE ${predicate} ESCAPE '\\' OR ${patterns.content} ILIKE ${predicate} ESCAPE '\\')`,
          )
          .orderBy(desc(patterns.updatedAt))
          .limit(20),
      );

      if (searchError !== null) {
        throw searchError;
      }

      return rows.map((row) => serializePatternDates(row));
    },
    inputSchema: searchPatternsInputSchema,
    name: "search_patterns",
  },
  {
    description:
      "Retorna o histórico completo de versões de um padrão específico, ordenado da mais antiga para a mais recente.",
    handler: async (inputRaw: unknown): Promise<unknown> => {
      const input = getPatternVersionsInputSchema.parse(inputRaw);
      const [rows, versionError] = await tryCatchAsync(async () =>
        db
          .select()
          .from(patternVersions)
          .where(eq(patternVersions.patternId, input.patternId))
          .orderBy(patternVersions.version),
      );

      if (versionError !== null) {
        if (
          versionError.message.includes("pattern_versions") === true ||
          versionError.message.toLowerCase().includes("does not exist") === true
        ) {
          throw new Error(
            "Consulta falhou — confirme se a migração com a tabela `pattern_versions` foi aplicada no banco PostgreSQL.",
          );
        }

        throw versionError;
      }

      return rows.map((row) => ({
        category: row.category,
        content: row.content,
        createdAt: row.createdAt.toISOString(),
        createdBy: row.createdBy,
        id: row.id,
        patternId: row.patternId,
        status: row.status,
        title: row.title,
        version: row.version,
      }));
    },
    inputSchema: getPatternVersionsInputSchema,
    name: "get_pattern_versions",
  },
  {
    description: "Retorna contagens agregadas: total de padrões por status e por categoria.",
    handler: async (inputRaw: unknown): Promise<unknown> => {
      getPatternStatsInputSchema.parse(inputRaw);

      const [statusRows, statusError] = await tryCatchAsync(async () =>
        db
          .select({
            count: count(),
            status: patterns.status,
          })
          .from(patterns)
          .groupBy(patterns.status),
      );

      if (statusError !== null) {
        throw statusError;
      }

      const [categoryRows, categoryError] = await tryCatchAsync(async () =>
        db
          .select({
            category: patterns.category,
            count: count(),
          })
          .from(patterns)
          .groupBy(patterns.category),
      );

      if (categoryError !== null) {
        throw categoryError;
      }

      return {
        patternsByCategory: categoryRows.map((row) => ({
          category: row.category,
          count: Number(row.count),
        })),
        patternsByStatus: statusRows.map((row) => ({
          count: Number(row.count),
          status: row.status,
        })),
      };
    },
    inputSchema: getPatternStatsInputSchema,
    name: "get_pattern_stats",
  },
];
