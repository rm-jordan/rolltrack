import { create } from "zustand";
import { sessionLogs as seededSessionLogs, techniques as seededTechniques } from "./mockData";
import type { SessionLog, Technique } from "./types";

type Stats = {
  totalTechniques: number;
  totalSessions: number;
  sessionsThisWeek: number;
  mostPracticedTechniqueName: string | null;
};

type RollTrackState = {
  techniques: Technique[];
  sessionLogs: SessionLog[];
  addSessionLog: (log: Omit<SessionLog, "id">) => void;
  getStats: () => Stats;
};

const getCurrentWeekStart = () => {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(now);
  monday.setDate(diff);
  monday.setHours(0, 0, 0, 0);
  return monday;
};

export const useRollTrackStore = create<RollTrackState>((set, get) => ({
  techniques: seededTechniques,
  sessionLogs: seededSessionLogs,
  addSessionLog: (logInput) => {
    const createdLog: SessionLog = {
      id: `session-${Date.now()}`,
      ...logInput,
    };

    set((state) => ({
      sessionLogs: [createdLog, ...state.sessionLogs],
    }));
  },
  getStats: () => {
    const { techniques, sessionLogs } = get();
    const weekStart = getCurrentWeekStart();

    const sessionsThisWeek = sessionLogs.filter((session) => {
      const sessionDate = new Date(session.date);
      return sessionDate >= weekStart;
    }).length;

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
      sessionsThisWeek,
      mostPracticedTechniqueName,
    };
  },
}));
