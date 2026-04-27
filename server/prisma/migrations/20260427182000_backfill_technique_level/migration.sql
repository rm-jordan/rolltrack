-- Backfill technique level values from belt guideline.
UPDATE "Technique"
SET "level" = CASE
  WHEN "beltGuideline" IN ('White', 'Blue') THEN 'Beginner'
  WHEN "beltGuideline" IN ('Purple', 'Brown') THEN 'Intermediate'
  WHEN "beltGuideline" = 'Black' THEN 'Advanced'
  ELSE NULL
END
WHERE "level" IS NULL;
