-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_TaskResource" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "taskId" INTEGER,
    "resourceName" TEXT NOT NULL,
    "resourceRole" TEXT,
    CONSTRAINT "TaskResource_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Tasks" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_TaskResource" ("id", "resourceName", "resourceRole", "taskId") SELECT "id", "resourceName", "resourceRole", "taskId" FROM "TaskResource";
DROP TABLE "TaskResource";
ALTER TABLE "new_TaskResource" RENAME TO "TaskResource";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
