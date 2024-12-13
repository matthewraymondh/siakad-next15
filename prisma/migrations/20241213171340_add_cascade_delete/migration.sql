-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Krs" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "mahasiswaId" INTEGER NOT NULL,
    "mataKuliahId" INTEGER NOT NULL,
    CONSTRAINT "Krs_mahasiswaId_fkey" FOREIGN KEY ("mahasiswaId") REFERENCES "Mahasiswa" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Krs_mataKuliahId_fkey" FOREIGN KEY ("mataKuliahId") REFERENCES "MataKuliah" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Krs" ("id", "mahasiswaId", "mataKuliahId") SELECT "id", "mahasiswaId", "mataKuliahId" FROM "Krs";
DROP TABLE "Krs";
ALTER TABLE "new_Krs" RENAME TO "Krs";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
