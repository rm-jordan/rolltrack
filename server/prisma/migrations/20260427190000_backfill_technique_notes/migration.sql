-- Backfill missing move explanations so cards show actionable guidance.
UPDATE "Technique"
SET "notes" = 'From ' || "position" || ', establish control first, off-balance your partner, and finish the ' || "name" || ' with tight positioning.'
WHERE "notes" IS NULL OR TRIM("notes") = '';
