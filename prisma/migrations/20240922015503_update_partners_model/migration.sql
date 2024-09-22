/*
  Warnings:

  - You are about to drop the `Person` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `personId` on the `Partner` table. All the data in the column will be lost.
  - Added the required column `balance` to the `Partner` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cpf` to the `Partner` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `Partner` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Partner` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Person_cpf_key";

-- DropIndex
DROP INDEX "Person_email_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Person";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Partner" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "balance" REAL NOT NULL,
    "participation" REAL NOT NULL
);
INSERT INTO "new_Partner" ("id", "participation") SELECT "id", "participation" FROM "Partner";
DROP TABLE "Partner";
ALTER TABLE "new_Partner" RENAME TO "Partner";
CREATE UNIQUE INDEX "Partner_email_key" ON "Partner"("email");
CREATE UNIQUE INDEX "Partner_cpf_key" ON "Partner"("cpf");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
