ALTER TABLE "equipment" ADD COLUMN "image_provider" TEXT;
UPDATE "equipment" SET "image_provider" = 'Pexels' WHERE "image_pexels_id" IS NOT NULL;
ALTER TABLE "equipment" RENAME COLUMN "image_pexels_id" TO "image_source_id";
ALTER TABLE "equipment" RENAME COLUMN "image_photographer" TO "image_creator";
DROP INDEX IF EXISTS "equipment_image_pexels_id_key";
CREATE UNIQUE INDEX "equipment_image_provider_image_source_id_key" ON "equipment"("image_provider", "image_source_id");
