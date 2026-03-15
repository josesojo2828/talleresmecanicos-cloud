/*
  Warnings:

  - A unique constraint covering the columns `[slug,country_id]` on the table `cities` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `countries` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `workshops` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "cities" ADD COLUMN     "slug" TEXT;

-- AlterTable
ALTER TABLE "countries" ADD COLUMN     "slug" TEXT;

-- AlterTable
ALTER TABLE "workshops" ADD COLUMN     "slug" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "cities_slug_country_id_key" ON "cities"("slug", "country_id");

-- CreateIndex
CREATE UNIQUE INDEX "countries_slug_key" ON "countries"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "workshops_slug_key" ON "workshops"("slug");
