import type { SessionLog, Technique } from "@rolltrack/shared";
import { create } from "zustand";
import {
  apiCreateSessionLog,
  apiCreateTechnique,
  apiDeleteTechnique,
  apiLoadAll,
  apiUpdateTechnique,
} from "@/services/graphql";

type DataSlice = {
  techniques: Technique[];
  sessionLogs: SessionLog[];
};

async function refreshAll(set: (partial: Partial<DataSlice>) => void) {
  const data = await apiLoadAll();
  set(data);
}

type Stats = {
  totalTechniques: number;
  totalSessions: number;
  mostPracticedTechniqueName: string | null;
};

type RollTrackState = {
  techniques: Technique[];
  sessionLogs: SessionLog[];
  /** Load techniques + session logs from GraphQL */
  hydrateFromApi: () => Promise<void>;
  addSessionLog: (log: Omit<SessionLog, "id">) => Promise<void>;
  createTechnique: (input: {
    name: string;
    position: string;
    category: string;
    beltGuideline: string;
    tags: string[];
    notes?: string;
  }) => Promise<void>;
  updateTechnique: (
    id: string,
    input: Partial<{
      name: string;
      position: string;
      category: string;
      beltGuideline: string;
      tags: string[];
      notes: string | null;
    }>,
  ) => Promise<void>;
  deleteTechnique: (id: string) => Promise<void>;
  getStats: () => Stats;
};

export const useRollTrackStore = create<RollTrackState>((set, get) => ({
  techniques: [],
  sessionLogs: [],

  hydrateFromApi: async () => {
    await refreshAll(set);
  },

  addSessionLog: async (logInput) => {
    await apiCreateSessionLog(logInput);
    await refreshAll(set);
  },

  createTechnique: async (input) => {
    await apiCreateTechnique(input);
    await refreshAll(set);
  },

  updateTechnique: async (id, input) => {
    await apiUpdateTechnique(id, input);
    await refreshAll(set);
  },

  deleteTechnique: async (id) => {
    await apiDeleteTechnique(id);
    await refreshAll(set);
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
