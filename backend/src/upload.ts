import { Hono } from "hono";
import { mkdir, writeFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import path from "node:path";
import { requireAuth } from "~/middlewares/requireAuth";
import type { AppVariables } from "~/types/app";

const persistUpload = async (file: File): Promise<string> => {
  const originalName = file.name.length > 0 ? file.name : "upload";
  const extName = path.extname(originalName);
  const ext = extName.length > 0 ? extName : ".bin";
  const fileName = `${randomUUID()}${ext}`;
  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadsDir, { recursive: true });
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const filePath = path.join(uploadsDir, fileName);
  await writeFile(filePath, buffer);
  return `/uploads/${fileName}`;
};

export const uploadApp = new Hono<{ Variables: AppVariables }>();

uploadApp.post("/", requireAuth, async (c) => {
  const formData = await c.req.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return c.json({ message: "Dado [file] é obrigatório" }, 400);
  }

  const url = await persistUpload(file);
  return c.json({ url }, 201);
});
