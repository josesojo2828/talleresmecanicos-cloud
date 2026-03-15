/*
  Warnings:

  - You are about to drop the column `languaje` on the `countries` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "countries" DROP COLUMN "languaje",
ADD COLUMN     "language" TEXT;
