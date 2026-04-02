import AsyncStorage from "@react-native-async-storage/async-storage";
import { openDatabaseAsync, type SQLiteDatabase } from "expo-sqlite";
import { sessionLogs as seededSessionLogs, techniques as seededTechniques } from "./mockData";
import type { SessionLog, Technique } from "./types";

const DB_NAME = "rolltrack.db";
const LEGACY_STORAGE_KEY = "rolltrack-storage";

let dbPromise: Promise<SQLiteDatabase> | null = null;

function getDb(): Promise<SQLiteDatabase> {
  if (!dbPromise) {
    dbPromise = openDatabaseAsync(DB_NAME);
  }
  return dbPromise;
}

const SCHEMA = `
PRAGMA journal_mode = WAL;
CREATE TABLE IF NOT EXISTS techniques (
  id TEXT PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,
  position TEXT NOT NULL,
  category TEXT NOT NULL,
  belt_guideline TEXT NOT NULL,
  tags_json TEXT NOT NULL DEFAULT '[]',
  notes TEXT,
  times_practiced INTEGER NOT NULL DEFAULT 0,
  last_practiced TEXT
);
CREATE TABLE IF NOT EXISTS session_logs (
  id TEXT PRIMARY KEY NOT NULL,
  date TEXT NOT NULL,
  gi_type TEXT NOT NULL,
  session_type TEXT NOT NULL,
  notes TEXT NOT NULL,
  techniques_json TEXT NOT NULL DEFAULT '[]',
  roll_notes_json TEXT
);
CREATE INDEX IF NOT EXISTS idx_session_logs_sort ON session_logs(date DESC, id DESC);
`;

async function ensureSchema(db: SQLiteDatabase): Promise<void> {
  await db.execAsync(SCHEMA);
}

type TechniqueRow = {
  id: string;
  name: string;
  position: string;
  category: string;
  belt_guideline: string;
  tags_json: string;
  notes: string | null;
  times_practiced: number;
  last_practiced: string | null;
};

type SessionLogRow = {
  id: string;
  date: string;
  gi_type: string;
  session_type: string;
  notes: string;
  techniques_json: string;
  roll_notes_json: string | null;
};

function rowToTechnique(row: TechniqueRow): Technique {
  let tags: string[] = [];
  try {
    tags = JSON.parse(row.tags_json) as string[];
  } catch {
    tags = [];
  }
  return {
    id: row.id,
    name: row.name,
    position: row.position,
    category: row.category as Technique["category"],
    beltGuideline: row.belt_guideline as Technique["beltGuideline"],
    tags,
    notes: row.notes ?? undefined,
    timesPracticed: row.times_practiced,
    lastPracticed: row.last_practiced ?? undefined,
  };
}

function rowToSessionLog(row: SessionLogRow): SessionLog {
  let techniquesPracticed: string[] = [];
  try {
    techniquesPracticed = JSON.parse(row.techniques_json) as string[];
  } catch {
    techniquesPracticed = [];
  }
  let rollNotes: SessionLog["rollNotes"];
  if (row.roll_notes_json) {
    try {
      rollNotes = JSON.parse(row.roll_notes_json) as NonNullable<SessionLog["rollNotes"]>;
    } catch {
      rollNotes = undefined;
    }
  }
  return {
    id: row.id,
    date: row.date,
    giType: row.gi_type as SessionLog["giType"],
    sessionType: row.session_type as SessionLog["sessionType"],
    techniquesPracticed,
    notes: row.notes,
    rollNotes,
  };
}

async function getTechniqueCount(db: SQLiteDatabase): Promise<number> {
  const row = await db.getFirstAsync<{ c: number }>("SELECT COUNT(*) AS c FROM techniques");
  return row?.c ?? 0;
}

async function insertTechnique(db: SQLiteDatabase, tech: Technique): Promise<void> {
  await db.runAsync(
    `INSERT OR REPLACE INTO techniques
      (id, name, position, category, belt_guideline, tags_json, notes, times_practiced, last_practiced)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    tech.id,
    tech.name,
    tech.position,
    tech.category,
    tech.beltGuideline,
    JSON.stringify(tech.tags),
    tech.notes ?? null,
    tech.timesPracticed,
    tech.lastPracticed ?? null,
  );
}

async function insertSessionLogRow(db: SQLiteDatabase, log: SessionLog): Promise<void> {
  await db.runAsync(
    `INSERT OR REPLACE INTO session_logs
      (id, date, gi_type, session_type, notes, techniques_json, roll_notes_json)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    log.id,
    log.date,
    log.giType,
    log.sessionType,
    log.notes,
    JSON.stringify(log.techniquesPracticed),
    log.rollNotes ? JSON.stringify(log.rollNotes) : null,
  );
}

async function seedFromMock(db: SQLiteDatabase): Promise<void> {
  await db.withTransactionAsync(async () => {
    for (const tech of seededTechniques) {
      await insertTechnique(db, tech);
    }
    for (const log of seededSessionLogs) {
      await insertSessionLogRow(db, log);
    }
  });
}

type LegacyPersistShape = {
  state?: { techniques?: Technique[]; sessionLogs?: SessionLog[] };
  techniques?: Technique[];
  sessionLogs?: SessionLog[];
};

async function migrateFromAsyncStorage(db: SQLiteDatabase): Promise<boolean> {
  const raw = await AsyncStorage.getItem(LEGACY_STORAGE_KEY);
  if (!raw) return false;

  let parsed: LegacyPersistShape;
  try {
    parsed = JSON.parse(raw) as LegacyPersistShape;
  } catch {
    return false;
  }

  const techniques = parsed.state?.techniques ?? parsed.techniques;
  const sessionLogs = parsed.state?.sessionLogs ?? parsed.sessionLogs;
  if (!techniques?.length) return false;

  await db.withTransactionAsync(async () => {
    for (const tech of techniques) {
      await insertTechnique(db, tech);
    }
    if (sessionLogs?.length) {
      for (const log of sessionLogs) {
        await insertSessionLogRow(db, log);
      }
    }
  });

  await AsyncStorage.removeItem(LEGACY_STORAGE_KEY);
  return true;
}

export async function loadRollTrackData(): Promise<{
  techniques: Technique[];
  sessionLogs: SessionLog[];
}> {
  const db = await getDb();
  const techRows = await db.getAllAsync<TechniqueRow>("SELECT * FROM techniques ORDER BY name COLLATE NOCASE ASC");
  const logRows = await db.getAllAsync<SessionLogRow>(
    "SELECT * FROM session_logs ORDER BY date DESC, id DESC",
  );
  return {
    techniques: techRows.map(rowToTechnique),
    sessionLogs: logRows.map(rowToSessionLog),
  };
}

/**
 * Open DB, create tables, seed or migrate if empty, return initial snapshot for the store.
 */
export async function initializeRollTrackDatabase(): Promise<{
  techniques: Technique[];
  sessionLogs: SessionLog[];
}> {
  const db = await getDb();
  await ensureSchema(db);

  const count = await getTechniqueCount(db);
  if (count === 0) {
    const migrated = await migrateFromAsyncStorage(db);
    if (!migrated) {
      await seedFromMock(db);
    }
  }

  return loadRollTrackData();
}

export async function persistSessionLog(logInput: Omit<SessionLog, "id">): Promise<void> {
  const db = await getDb();
  const id = `session-${Date.now()}`;
  const sessionDate = logInput.date;
  const log: SessionLog = { id, ...logInput };

  await db.withTransactionAsync(async () => {
    await insertSessionLogRow(db, log);

    for (const tid of logInput.techniquesPracticed) {
      await db.runAsync(
        `UPDATE techniques SET
          times_practiced = times_practiced + 1,
          last_practiced = CASE
            WHEN last_practiced IS NULL OR last_practiced < ? THEN ?
            ELSE last_practiced
          END
         WHERE id = ?`,
        sessionDate,
        sessionDate,
        tid,
      );
    }
  });
}
