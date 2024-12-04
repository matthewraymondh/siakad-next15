-- CreateTable
CREATE TABLE "Mahasiswa" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nim" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "ipk" REAL NOT NULL,
    "sksMax" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "MataKuliah" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "kodeMk" TEXT NOT NULL,
    "namaMk" TEXT NOT NULL,
    "sks" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Krs" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "mahasiswaId" INTEGER NOT NULL,
    "mataKuliahId" INTEGER NOT NULL,
    CONSTRAINT "Krs_mahasiswaId_fkey" FOREIGN KEY ("mahasiswaId") REFERENCES "Mahasiswa" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Krs_mataKuliahId_fkey" FOREIGN KEY ("mataKuliahId") REFERENCES "MataKuliah" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Mahasiswa_nim_key" ON "Mahasiswa"("nim");

-- CreateIndex
CREATE UNIQUE INDEX "MataKuliah_kodeMk_key" ON "MataKuliah"("kodeMk");
