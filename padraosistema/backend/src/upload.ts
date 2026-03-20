import { Hono } from "hono";
import { mkdir, writeFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import path from "node:path";

export const uploadApp = new Hono();

uploadApp.post("/", async (c) => {
  const formData = await c.req.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return c.json({ message: "Dado [file] é obrigatório" }, 400);
  }

  const originalName = file.name ?? "upload";
  const ext = path.extname(originalName) || ".bin";
  const fileName = `${randomUUID()}${ext}`;
  const uploadsDir = path.join(process.cwd(), "public", "uploads");

  await mkdir(uploadsDir, { recursive: true });

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const filePath = path.join(uploadsDir, fileName);
  await writeFile(filePath, buffer);

  const url = `/uploads/${fileName}`;
  return c.json({ url }, 201);
});

