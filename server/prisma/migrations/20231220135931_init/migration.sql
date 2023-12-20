/*
  Warnings:

  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Post";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "User";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Tick" (
    "tick" TEXT NOT NULL PRIMARY KEY,
    "minted" BIGINT NOT NULL DEFAULT 0,
    "total" BIGINT NOT NULL DEFAULT 0,
    "holders" BIGINT NOT NULL DEFAULT 0,
    "creator" TEXT NOT NULL,
    "limit" BIGINT NOT NULL,
    "deployHash" TEXT NOT NULL,
    "lastTime" DATETIME NOT NULL,
    "deployTime" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Holder" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tick" TEXT NOT NULL,
    "value" BIGINT NOT NULL,
    "owner" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Inscription" (
    "hash" TEXT NOT NULL PRIMARY KEY,
    "op" TEXT NOT NULL,
    "tick" TEXT NOT NULL,
    "json" TEXT NOT NULL,
    "from" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "time" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "Tick_tick_key" ON "Tick"("tick");

-- CreateIndex
CREATE UNIQUE INDEX "Tick_deployHash_key" ON "Tick"("deployHash");
