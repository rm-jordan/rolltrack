import type { SessionLog, Technique } from "./types";

export const techniques: Technique[] = [
  {
    id: "tech-1",
    name: "Triangle from Guard",
    position: "Closed Guard",
    category: "Submission",
    beltGuideline: "White",
    tags: ["choke", "fundamental"],
    notes: "Break posture first, then angle off before locking.",
    timesPracticed: 5,
    lastPracticed: "2026-03-25",
  },
  {
    id: "tech-2",
    name: "Knee Cut Pass",
    position: "Top Passing",
    category: "Pass",
    beltGuideline: "White",
    tags: ["pressure", "guard pass"],
    notes: "Control near-side underhook to avoid the back-take.",
    timesPracticed: 8,
    lastPracticed: "2026-03-24",
  },
  {
    id: "tech-3",
    name: "Scissor Sweep",
    position: "Guard",
    category: "Sweep",
    beltGuideline: "White",
    tags: ["fundamental", "off-balance"],
    timesPracticed: 4,
    lastPracticed: "2026-03-22",
  },
  {
    id: "tech-4",
    name: "Single Leg X Sweep",
    position: "Single Leg X",
    category: "Sweep",
    beltGuideline: "Blue",
    tags: ["ashi", "off-balance"],
    timesPracticed: 2,
    lastPracticed: "2026-03-18",
  },
  {
    id: "tech-5",
    name: "Back Escape to Half Guard",
    position: "Back Control Defense",
    category: "Escape",
    beltGuideline: "Blue",
    tags: ["defense", "survival"],
    timesPracticed: 3,
    lastPracticed: "2026-03-20",
  },
];

export const sessionLogs: SessionLog[] = [
  {
    id: "session-1",
    date: "2026-03-26",
    giType: "Gi",
    sessionType: "Class",
    techniquesPracticed: ["tech-1", "tech-2"],
    notes: "Focused on posture breaks and passing entries.",
    rollNotes: [
      {
        partner: "Alex",
        rounds: 3,
        notes: "Got swept from DLR twice, recovered with knee cut once.",
      },
    ],
  },
  {
    id: "session-2",
    date: "2026-03-24",
    giType: "No-Gi",
    sessionType: "Open Mat",
    techniquesPracticed: ["tech-4", "tech-5"],
    notes: "Worked leg entanglement entries and back escape details.",
  },
];