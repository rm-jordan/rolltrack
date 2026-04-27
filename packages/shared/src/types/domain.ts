export type BeltLevel = "White" | "Blue" | "Purple" | "Brown" | "Black";
export type TechniqueLevel = "Beginner" | "Intermediate" | "Advanced";

export type SessionGiType = "Gi" | "No-Gi";

export type SessionType = "Class" | "Open Mat" | "Drilling" | "Competition";

export type TechniqueCategory =
  | "Submission"
  | "Pass"
  | "Sweep"
  | "Escape"
  | "Takedown"
  | "Control";

export type Technique = {
  id: string;
  name: string;
  position: string;
  category: TechniqueCategory;
  beltGuideline: BeltLevel;
  level?: TechniqueLevel;
  tags: string[];
  notes?: string;
  timesPracticed: number;
  lastPracticed?: string;
};

export type RollNote = {
  partner: string;
  rounds: number;
  notes: string;
};

export type SessionLog = {
  id: string;
  date: string;
  giType: SessionGiType;
  sessionType: SessionType;
  techniquesPracticed: string[];
  notes: string;
  rollNotes?: RollNote[];
};
