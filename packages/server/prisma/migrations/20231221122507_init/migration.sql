/*
  Warnings:

  - The primary key for the `Inscription` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `number` to the `Inscription` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Inscription" (
    "number" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "hash" TEXT NOT NULL,
    "op" TEXT NOT NULL,
    "tick" TEXT NOT NULL,
    "json" TEXT NOT NULL,
    "from" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "time" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Inscription" ("from", "hash", "json", "op", "tick", "time", "to") SELECT "from", "hash", "json", "op", "tick", "time", "to" FROM "Inscription";
DROP TABLE "Inscription";
ALTER TABLE "new_Inscription" RENAME TO "Inscription";
CREATE UNIQUE INDEX "Inscription_hash_key" ON "Inscription"("hash");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
