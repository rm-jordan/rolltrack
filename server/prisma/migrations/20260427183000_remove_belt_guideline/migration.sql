-- Ensure level has a value for all rows before making it required.
UPDATE "Technique"
SET "level" = 'Beginner'
WHERE "level" IS NULL;

-- Recreate Technique table without beltGuideline and with required level.
CREATE TABLE "new_Technique" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "position" TEXT NOT NULL,
  "category" TEXT NOT NULL,
  "level" TEXT NOT NULL,
  "tags" JSONB NOT NULL,
  "notes" TEXT,
  "timesPracticed" INTEGER NOT NULL DEFAULT 0,
  "lastPracticed" TEXT
);

INSERT INTO "new_Technique" (
  "id",
  "name",
  "position",
  "category",
  "level",
  "tags",
  "notes",
  "timesPracticed",
  "lastPracticed"
)
SELECT
  "id",
  "name",
  "position",
  "category",
  "level",
  "tags",
  "notes",
  "timesPracticed",
  "lastPracticed"
FROM "Technique";

DROP TABLE "Technique";
ALTER TABLE "new_Technique" RENAME TO "Technique";
