/*
  Warnings:

  - You are about to drop the column `winner` on the `Winners` table. All the data in the column will be lost.
  - Added the required column `name` to the `Winners` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Winners" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "raffleId" INTEGER NOT NULL,
    CONSTRAINT "Winners_raffleId_fkey" FOREIGN KEY ("raffleId") REFERENCES "Raffle" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Winners" ("id", "raffleId") SELECT "id", "raffleId" FROM "Winners";
DROP TABLE "Winners";
ALTER TABLE "new_Winners" RENAME TO "Winners";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
