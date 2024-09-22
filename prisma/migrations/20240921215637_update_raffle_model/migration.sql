/*
  Warnings:

  - Added the required column `animal` to the `Raffle` table without a default value. This is not possible if the table is not empty.

*/
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
    "winner" TEXT NOT NULL,
    "animal" TEXT NOT NULL
);
INSERT INTO "new_Raffle" ("date", "dividend", "id", "prize", "time", "totalBet", "winner") SELECT "date", "dividend", "id", "prize", "time", "totalBet", "winner" FROM "Raffle";
DROP TABLE "Raffle";
ALTER TABLE "new_Raffle" RENAME TO "Raffle";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
