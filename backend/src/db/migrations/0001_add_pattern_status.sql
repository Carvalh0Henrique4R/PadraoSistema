ALTER TABLE "patterns" ADD COLUMN IF NOT EXISTS "status" text DEFAULT 'draft' NOT NULL;
