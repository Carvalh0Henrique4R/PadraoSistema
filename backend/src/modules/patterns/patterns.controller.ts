import type { Hono } from "hono";
import { raise, tryCatchAsync } from "@padraosistema/lib";
import { requireAuth } from "~/middlewares/requireAuth";
import type { AppVariables } from "~/types/app";
import { registerPatternVersionRoutes } from "~/modules/patternVersions/patternVersions.controller";
import { importMarkdownPatternsForUser } from "./import-markdown/import-markdown.actions";
import { importPatternsForUser } from "./import/patterns.import.actions";
import {
  createPatternForUser,
  deletePatternForUser,
  getPatternForApi,
  listPatternsForApi,
  updatePatternForUser,
} from "./patterns.actions";
import { PatternForbiddenError, PatternNotFoundError } from "./patterns.errors";
import { firstZodMessage, patternInputSchema } from "./patterns.schema";
import { respondIfPutPatternError } from "./patterns.routeErrors";

export const registerPatternRoutes = (app: Hono<{ Variables: AppVariables }>): void => {
  app.post("/import", requireAuth, async (c) => {
    const database = c.get("db");
    const user = c.get("user") ?? raise("Missing authenticated user");
    const [jsonBody, jsonErr] = await tryCatchAsync(() => c.req.json());
    if (jsonErr != null) {
      return c.json({ message: "Corpo da requisição inválido" }, 400);
    }
    const result = await importPatternsForUser({
      body: jsonBody,
      database,
      userId: user.id,
    });
    if (result.ok) {
      return c.json({ created: result.created, success: true });
    }
    if (result.index == null) {
      return c.json({ message: result.message }, 400);
    }
    return c.json({ index: result.index, message: result.message }, 400);
  });

  app.post("/import/markdown", requireAuth, async (c) => {
    const database = c.get("db");
    const user = c.get("user") ?? raise("Missing authenticated user");
    const [formData, fdErr] = await tryCatchAsync(() => c.req.formData());
    if (fdErr != null) {
      return c.json({ message: "Formulário inválido" }, 400);
    }
    const entries = formData.getAll("file");
    const files = entries.filter((item): item is File => item instanceof File);
    const result = await importMarkdownPatternsForUser({
      database,
      files,
      userId: user.id,
    });
    if (result.ok) {
      return c.json({ created: result.created, success: true });
    }
    if ("index" in result) {
      return c.json({ index: result.index, message: result.message }, 400);
    }
    return c.json({ message: result.message }, 400);
  });

  registerPatternVersionRoutes(app);

  app.get("/", async (c) => {
    const database = c.get("db");
    const category = c.req.query("category");
    const data = await listPatternsForApi(database, category);
    return c.json(data);
  });

  app.get("/:id", async (c) => {
    const database = c.get("db");
    const id = c.req.param("id");
    const [data, err] = await tryCatchAsync(async () => getPatternForApi(database, id));
    if (err != null) {
      if (err instanceof PatternNotFoundError) {
        return c.json({ message: "Padrão não encontrado" }, 404);
      }
      throw err;
    }
    return c.json(data);
  });

  app.post("/", requireAuth, async (c) => {
    const database = c.get("db");
    const user = c.get("user") ?? raise("Missing authenticated user");
    const body: unknown = await c.req.json();
    const parsed = patternInputSchema.safeParse(body);
    if (!parsed.success) {
      return c.json({ message: firstZodMessage(parsed.error) }, 400);
    }
    const data = await createPatternForUser({
      database,
      input: parsed.data,
      userId: user.id,
    });
    return c.json(data, 201);
  });

  app.put("/:id", requireAuth, async (c) => {
    const database = c.get("db");
    const user = c.get("user") ?? raise("Missing authenticated user");
    const id = c.req.param("id");
    const body: unknown = await c.req.json();
    const parsed = patternInputSchema.safeParse(body);
    if (!parsed.success) {
      return c.json({ message: firstZodMessage(parsed.error) }, 400);
    }
    const [data, err] = await tryCatchAsync(async () =>
      updatePatternForUser({
        database,
        id,
        input: parsed.data,
        userId: user.id,
      }),
    );
    if (err != null) {
      const mapped = respondIfPutPatternError({ c, err });
      if (mapped != null) {
        return mapped;
      }
      throw err;
    }
    return c.json(data);
  });

  app.delete("/:id", requireAuth, async (c) => {
    const database = c.get("db");
    const user = c.get("user") ?? raise("Missing authenticated user");
    const id = c.req.param("id");
    const [, err] = await tryCatchAsync(async () => deletePatternForUser({ database, id, userId: user.id }));
    if (err != null) {
      if (err instanceof PatternNotFoundError) {
        return c.json({ message: "Padrão não encontrado" }, 404);
      }
      if (err instanceof PatternForbiddenError) {
        return c.json({ message: "Sem permissão para este padrão" }, 403);
      }
      throw err;
    }
    return c.json({ success: true });
  });
};
