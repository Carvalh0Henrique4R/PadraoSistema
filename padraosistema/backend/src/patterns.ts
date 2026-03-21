import { z } from "zod";
import type { Pattern, PatternInput, PatternStatus } from "@padraosistema/lib";
import { Hono } from "hono";
import { eq } from "drizzle-orm";
import { patterns } from "./db/schema/patterns";
import type { db } from "./db/index";

const patternStatusSchema = z.enum(["stable", "review", "draft", "deprecated"]);

const patternInputSchema = z.object({
  title: z.string().min(1, "Dado [title] é obrigatório"),
  category: z.string().min(1, "Dado [category] é obrigatório"),
  content: z.string().min(1, "Dado [content] é obrigatório"),
  status: patternStatusSchema.optional(),
});

type AppDb = typeof db;

type Variables = {
  db: AppDb;
};

const mapStatus = (value: string): PatternStatus => {
  const parsedStatus = patternStatusSchema.safeParse(value);
  return parsedStatus.success ? parsedStatus.data : "draft";
};

const mapRecordToPattern = (record: typeof patterns.$inferSelect): Pattern => ({
  id: record.id,
  title: record.title,
  category: record.category,
  content: record.content,
  status: mapStatus(record.status),
  createdAt: record.createdAt.toISOString(),
});

const firstZodMessage = (error: z.ZodError): string => {
  const issue = error.issues[0];
  return issue.message;
};

export const patternsApp = new Hono<{ Variables: Variables }>();

patternsApp.get("/", async (c) => {
  const database = c.get("db");
  const category = c.req.query("category");

  const rows =
    category != null && category.length > 0
      ? await database.select().from(patterns).where(eq(patterns.category, category))
      : await database.select().from(patterns);

  const data: Pattern[] = rows.map(mapRecordToPattern);
  return c.json(data);
});

patternsApp.get("/:id", async (c) => {
  const database = c.get("db");
  const id = c.req.param("id");

  const [row] = await database.select().from(patterns).where(eq(patterns.id, id));
  if (row == null) {
    return c.json({ message: "Padrão não encontrado" }, 404);
  }

  const data: Pattern = mapRecordToPattern(row);
  return c.json(data);
});

patternsApp.post("/", async (c) => {
  const database = c.get("db");
  const body = await c.req.json();
  const parsed = patternInputSchema.safeParse(body);

  if (!parsed.success) {
    return c.json({ message: firstZodMessage(parsed.error) }, 400);
  }

  const input: PatternInput = parsed.data;

  const [inserted] = await database
    .insert(patterns)
    .values({
      title: input.title,
      category: input.category,
      content: input.content,
      status: input.status ?? "draft",
    })
    .returning();

  const data: Pattern = mapRecordToPattern(inserted);
  return c.json(data, 201);
});

patternsApp.put("/:id", async (c) => {
  const database = c.get("db");
  const id = c.req.param("id");
  const body = await c.req.json();
  const parsed = patternInputSchema.safeParse(body);

  if (!parsed.success) {
    return c.json({ message: firstZodMessage(parsed.error) }, 400);
  }

  const input: PatternInput = parsed.data;

  const [existing] = await database.select().from(patterns).where(eq(patterns.id, id));
  if (existing == null) {
    return c.json({ message: "Padrão não encontrado" }, 404);
  }

  const nextStatus = input.status != null ? input.status : mapStatus(existing.status);

  const [updated] = await database
    .update(patterns)
    .set({
      title: input.title,
      category: input.category,
      content: input.content,
      status: nextStatus,
    })
    .where(eq(patterns.id, id))
    .returning();

  if (updated == null) {
    return c.json({ message: "Padrão não encontrado" }, 404);
  }

  const data: Pattern = mapRecordToPattern(updated);
  return c.json(data);
});

patternsApp.delete("/:id", async (c) => {
  const database = c.get("db");
  const id = c.req.param("id");

  const [deleted] = await database.delete(patterns).where(eq(patterns.id, id)).returning();
  if (deleted == null) {
    return c.json({ message: "Padrão não encontrado" }, 404);
  }

  return c.json({ success: true });
});
