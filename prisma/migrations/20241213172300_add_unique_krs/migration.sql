/*
  Warnings:

  - A unique constraint covering the columns `[mahasiswaId,mataKuliahId]` on the table `Krs` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Krs_mahasiswaId_mataKuliahId_key" ON "Krs"("mahasiswaId", "mataKuliahId");
