import { create } from "zustand";
import { sessionLogs as seededSessionLogs, techniques as seededTechniques } from "./mockData";
import type { SessionLog, Technique } from "./types";

type Stats = {
  totalTechniques: number;
  totalSessions: number;
  mostPracticedTechniqueName: string | null;
};

type RollTrackState = {
  techniques: Technique[];
  sessionLogs: SessionLog[];
  addSessionLog: (log: Omit<SessionLog, "id">) => void;
  getStats: () => Stats;
};

export const useRollTrackStore = create<RollTrackState>((set, get) => ({
  techniques: seededTechniques,
  sessionLogs: seededSessionLogs,
  addSessionLog: (logInput) => {
    const createdLog: SessionLog = {
      id: `session-${Date.now()}`,
      ...logInput,
    };

    const sessionDate = logInput.date;
    const practicedIds = new Set(logInput.techniquesPracticed);

    set((state) => {
      const nextTechniques = state.techniques.map((tech) => {
        if (!practicedIds.has(tech.id)) {
          return tech;
        }
        const lastPracticed =
          tech.lastPracticed && tech.lastPracticed >= sessionDate ? tech.lastPracticed : sessionDate;
        return {
          ...tech,
          timesPracticed: tech.timesPracticed + 1,
          lastPracticed,
        };
      });

      return {
        sessionLogs: [createdLog, ...state.sessionLogs],
        techniques: nextTechniques,
      };
    });
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
