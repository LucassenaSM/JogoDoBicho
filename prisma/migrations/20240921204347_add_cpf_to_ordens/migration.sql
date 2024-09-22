/*
  Warnings:

  - Added the required column `cpf` to the `Ordens` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Ordens" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "animal" TEXT NOT NULL,
    "value" REAL NOT NULL,
    "cpf" TEXT NOT NULL,
    "raffleId" INTEGER NOT NULL,
    CONSTRAINT "Ordens_raffleId_fkey" FOREIGN KEY ("raffleId") REFERENCES "Raffle" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Ordens" ("animal", "id", "raffleId", "value") SELECT "animal", "id", "raffleId", "value" FROM "Ordens";
DROP TABLE "Ordens";
ALTER TABLE "new_Ordens" RENAME TO "Ordens";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
