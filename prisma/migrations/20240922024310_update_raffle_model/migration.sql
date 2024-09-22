/*
  Warnings:

  - You are about to drop the column `winner` on the `Raffle` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "Winners" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "winner" TEXT NOT NULL,
    "raffleId" INTEGER NOT NULL,
    CONSTRAINT "Winners_raffleId_fkey" FOREIGN KEY ("raffleId") REFERENCES "Raffle" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Raffle" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" DATETIME NOT NULL,
    "time" DATETIME NOT NULL,
    "totalBet" REAL,
    "prize" REAL,
    "dividend" REAL,
    "animal" TEXT NOT NULL
);
INSERT INTO "new_Raffle" ("animal", "date", "dividend", "id", "prize", "time", "totalBet") SELECT "animal", "date", "dividend", "id", "prize", "time", "totalBet" FROM "Raffle";
DROP TABLE "Raffle";
ALTER TABLE "new_Raffle" RENAME TO "Raffle";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
