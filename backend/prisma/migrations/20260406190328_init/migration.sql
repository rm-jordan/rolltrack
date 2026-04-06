-- CreateTable
CREATE TABLE "Technique" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "beltGuideline" TEXT NOT NULL,
    "tags" JSONB NOT NULL,
    "notes" TEXT,
    "timesPracticed" INTEGER NOT NULL DEFAULT 0,
    "lastPracticed" TEXT
);

-- CreateTable
CREATE TABLE "SessionLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" TEXT NOT NULL,
    "giType" TEXT NOT NULL,
    "sessionType" TEXT NOT NULL,
    "notes" TEXT NOT NULL,
    "techniquesPracticed" JSONB NOT NULL,
    "rollNotes" JSONB
);
