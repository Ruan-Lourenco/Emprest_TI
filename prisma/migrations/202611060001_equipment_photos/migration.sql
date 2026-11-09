ALTER TABLE "equipment"
  ADD COLUMN "image_url" TEXT,
  ADD COLUMN "image_pexels_id" TEXT,
  ADD COLUMN "image_photographer" TEXT,
  ADD COLUMN "image_source_url" TEXT,
  ADD COLUMN "image_license" TEXT;

CREATE UNIQUE INDEX "equipment_image_pexels_id_key" ON "equipment"("image_pexels_id");
