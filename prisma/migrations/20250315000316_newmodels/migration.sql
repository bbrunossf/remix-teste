/*
  Warnings:

  - You are about to drop the `Dependencies` table. If the table is not empty, all the data it contains will be lost.
  - The primary key for the `Tasks` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `calendar` on the `Tasks` table. All the data in the column will be lost.
  - You are about to drop the column `cls` on the `Tasks` table. All the data in the column will be lost.
  - You are about to drop the column `color` on the `Tasks` table. All the data in the column will be lost.
  - You are about to drop the column `constraintDate` on the `Tasks` table. All the data in the column will be lost.
  - You are about to drop the column `constraintType` on the `Tasks` table. All the data in the column will be lost.
  - You are about to drop the column `deadline` on the `Tasks` table. All the data in the column will be lost.
  - You are about to drop the column `delayFromParent` on the `Tasks` table. All the data in the column will be lost.
  - You are about to drop the column `direction` on the `Tasks` table. All the data in the column will be lost.
  - You are about to drop the column `durationUnit` on the `Tasks` table. All the data in the column will be lost.
  - You are about to drop the column `effort` on the `Tasks` table. All the data in the column will be lost.
  - You are about to drop the column `effortDriven` on the `Tasks` table. All the data in the column will be lost.
  - You are about to drop the column `effortUnit` on the `Tasks` table. All the data in the column will be lost.
  - You are about to drop the column `expanded` on the `Tasks` table. All the data in the column will be lost.
  - You are about to drop the column `iconCls` on the `Tasks` table. All the data in the column will be lost.
  - You are about to drop the column `inactive` on the `Tasks` table. All the data in the column will be lost.
  - You are about to drop the column `manuallyScheduled` on the `Tasks` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Tasks` table. All the data in the column will be lost.
  - You are about to drop the column `note` on the `Tasks` table. All the data in the column will be lost.
  - You are about to drop the column `parentIndex` on the `Tasks` table. All the data in the column will be lost.
  - You are about to drop the column `percentDone` on the `Tasks` table. All the data in the column will be lost.
  - You are about to drop the column `projectConstraintResolution` on the `Tasks` table. All the data in the column will be lost.
  - You are about to drop the column `schedulingMode` on the `Tasks` table. All the data in the column will be lost.
  - You are about to drop the column `unscheduled` on the `Tasks` table. All the data in the column will be lost.
  - You are about to alter the column `id` on the `Tasks` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - Added the required column `taskName` to the `Tasks` table without a default value. This is not possible if the table is not empty.
  - Made the column `endDate` on table `Tasks` required. This step will fail if there are existing NULL values in that column.
  - Made the column `startDate` on table `Tasks` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "toEvent";

-- DropIndex
DROP INDEX "fromEvent";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Dependencies";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "TaskResource" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "taskId" INTEGER NOT NULL,
    "resourceName" TEXT NOT NULL,
    "resourceRole" TEXT,
    CONSTRAINT "TaskResource_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Tasks" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Tasks" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "parentId" TEXT,
    "taskName" TEXT NOT NULL,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL,
    "duration" REAL DEFAULT 0.0,
    "notes" TEXT,
    "progress" REAL DEFAULT 0.0,
    "predecessor" TEXT
);
INSERT INTO "new_Tasks" ("duration", "endDate", "id", "parentId", "startDate") SELECT "duration", "endDate", "id", "parentId", "startDate" FROM "Tasks";
DROP TABLE "Tasks";
ALTER TABLE "new_Tasks" RENAME TO "Tasks";
CREATE INDEX "parentId" ON "Tasks"("parentId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
