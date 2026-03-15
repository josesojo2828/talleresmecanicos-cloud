/*
  Warnings:

  - You are about to drop the column `latitude` on the `countries` table. All the data in the column will be lost.
  - You are about to drop the column `longitude` on the `countries` table. All the data in the column will be lost.
  - Added the required column `user_id` to the `publications` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "countries" DROP COLUMN "latitude",
DROP COLUMN "longitude",
ADD COLUMN     "currency_id" TEXT,
ADD COLUMN     "languaje" TEXT,
ADD COLUMN     "timezone" TEXT,
ALTER COLUMN "enabled" SET DEFAULT false;

-- AlterTable
ALTER TABLE "forum_posts" ALTER COLUMN "enabled" SET DEFAULT false;

-- AlterTable
ALTER TABLE "publications" ADD COLUMN     "user_id" TEXT NOT NULL,
ALTER COLUMN "workshop_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "publications" ADD CONSTRAINT "publications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
