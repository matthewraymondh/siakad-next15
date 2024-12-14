-- CreateTable
CREATE TABLE "Mahasiswa" (
    "id" SERIAL NOT NULL,
    "nim" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "ipk" DOUBLE PRECISION NOT NULL,
    "sksMax" INTEGER NOT NULL,

    CONSTRAINT "Mahasiswa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MataKuliah" (
    "id" SERIAL NOT NULL,
    "kodeMk" TEXT NOT NULL,
    "namaMk" TEXT NOT NULL,
    "sks" INTEGER NOT NULL,
    "ruangan" TEXT NOT NULL,

    CONSTRAINT "MataKuliah_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Krs" (
    "id" SERIAL NOT NULL,
    "mahasiswaId" INTEGER NOT NULL,
    "mataKuliahId" INTEGER NOT NULL,

    CONSTRAINT "Krs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounts" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "provider_account_id" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "session_token" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "email_verified" TIMESTAMP(3),
    "image" TEXT,
    "password" TEXT,
    "role" TEXT NOT NULL DEFAULT 'user',

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification_tokens" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Mahasiswa_nim_key" ON "Mahasiswa"("nim");

-- CreateIndex
CREATE UNIQUE INDEX "MataKuliah_kodeMk_key" ON "MataKuliah"("kodeMk");

-- CreateIndex
CREATE UNIQUE INDEX "Krs_mahasiswaId_mataKuliahId_key" ON "Krs"("mahasiswaId", "mataKuliahId");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_provider_provider_account_id_key" ON "accounts"("provider", "provider_account_id");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_session_token_key" ON "sessions"("session_token");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_identifier_token_key" ON "verification_tokens"("identifier", "token");

-- AddForeignKey
ALTER TABLE "Krs" ADD CONSTRAINT "Krs_mahasiswaId_fkey" FOREIGN KEY ("mahasiswaId") REFERENCES "Mahasiswa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Krs" ADD CONSTRAINT "Krs_mataKuliahId_fkey" FOREIGN KEY ("mataKuliahId") REFERENCES "MataKuliah"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
