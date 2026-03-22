/*
  Warnings:

  - A unique constraint covering the columns `[work_id,part_id]` on the table `work_parts` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "work_parts_work_id_part_id_key" ON "work_parts"("work_id", "part_id");
