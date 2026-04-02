import { create } from "zustand";
import { loadRollTrackData, persistSessionLog } from "./db";
import type { SessionLog, Technique } from "./types";

type Stats = {
  totalTechniques: number;
  totalSessions: number;
  mostPracticedTechniqueName: string | null;
};

type RollTrackState = {
  techniques: Technique[];
  sessionLogs: SessionLog[];
  addSessionLog: (log: Omit<SessionLog, "id">) => Promise<void>;
  getStats: () => Stats;
};

export const useRollTrackStore = create<RollTrackState>((set, get) => ({
  techniques: [],
  sessionLogs: [],
  addSessionLog: async (logInput) => {
    await persistSessionLog(logInput);
    set(await loadRollTrackData());
  },
  getStats: () => {
    const { techniques, sessionLogs } = get();

    let mostPracticedTechniqueName: string | null = null;
    let maxPracticeCount = 0;

    for (const technique of techniques) {
      if (technique.timesPracticed > maxPracticeCount) {
        maxPracticeCount = technique.timesPracticed;
        mostPracticedTechniqueName = technique.name;
      }
    }

    return {
      totalTechniques: techniques.length,
      totalSessions: sessionLogs.length,
      mostPracticedTechniqueName,
    };
  },
}));
