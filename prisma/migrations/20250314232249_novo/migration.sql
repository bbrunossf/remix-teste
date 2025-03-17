-- CreateTable
CREATE TABLE "Tasks" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "parentId" TEXT,
    "name" TEXT,
    "startDate" DATETIME,
    "endDate" DATETIME,
    "effort" REAL,
    "effortUnit" TEXT DEFAULT 'hour',
    "duration" REAL,
    "durationUnit" TEXT DEFAULT 'day',
    "percentDone" REAL DEFAULT 0.00,
    "schedulingMode" TEXT,
    "note" TEXT,
    "constraintType" TEXT,
    "constraintDate" DATETIME,
    "manuallyScheduled" BOOLEAN,
    "effortDriven" BOOLEAN,
    "inactive" BOOLEAN,
    "cls" TEXT,
    "iconCls" TEXT,
    "color" TEXT,
    "parentIndex" INTEGER DEFAULT 0,
    "expanded" INTEGER DEFAULT 0,
    "calendar" INTEGER,
    "deadline" DATETIME,
    "direction" TEXT,
    "unscheduled" BOOLEAN,
    "projectConstraintResolution" TEXT,
    "delayFromParent" INTEGER
);

-- CreateTable
CREATE TABLE "Dependencies" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fromEvent" TEXT,
    "toEvent" TEXT,
    "type" INTEGER DEFAULT 2,
    "cls" TEXT,
    "lag" REAL DEFAULT 0,
    "lagUnit" TEXT DEFAULT 'day',
    "active" BOOLEAN,
    "fromSide" TEXT,
    "toSide" TEXT
);

-- CreateIndex
CREATE INDEX "parentId" ON "Tasks"("parentId");

-- CreateIndex
CREATE INDEX "calendar" ON "Tasks"("calendar");

-- CreateIndex
CREATE INDEX "fromEvent" ON "Dependencies"("fromEvent");

-- CreateIndex
CREATE INDEX "toEvent" ON "Dependencies"("toEvent");
