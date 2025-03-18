/*
  Warnings:

  - You are about to drop the column `taskId` on the `TaskResource` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "TaskResourceAssignment" (
    "taskId" INTEGER NOT NULL,
    "taskResourceId" INTEGER NOT NULL,

    PRIMARY KEY ("taskId", "taskResourceId"),
    CONSTRAINT "TaskResourceAssignment_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Tasks" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "TaskResourceAssignment_taskResourceId_fkey" FOREIGN KEY ("taskResourceId") REFERENCES "TaskResource" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_TaskResource" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "resourceName" TEXT NOT NULL,
    "resourceRole" TEXT
);
INSERT INTO "new_TaskResource" ("id", "resourceName", "resourceRole") SELECT "id", "resourceName", "resourceRole" FROM "TaskResource";
DROP TABLE "TaskResource";
ALTER TABLE "new_TaskResource" RENAME TO "TaskResource";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
