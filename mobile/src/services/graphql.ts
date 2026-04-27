import type { SessionLog, Technique, TechniqueCategory, TechniqueLevel } from "@rolltrack/shared";
import { getGraphqlUrl } from "@/lib/config";

type GraphqlResponse<T> = { data?: T; errors?: { message: string }[] };

async function graphqlRequest<TData>(query: string, variables?: Record<string, unknown>): Promise<TData> {
  const url = getGraphqlUrl();
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
  });
  const json = (await res.json()) as GraphqlResponse<TData>;
  if (!res.ok) {
    throw new Error(`GraphQL HTTP ${res.status}`);
  }
  if (json.errors?.length) {
    throw new Error(json.errors[0]?.message ?? "GraphQL error");
  }
  if (!json.data) {
    throw new Error("Empty GraphQL response");
  }
  return json.data;
}

const TECHNIQUE_FIELDS = `
  id
  name
  position
  category
  level
  tags
  notes
  timesPracticed
  lastPracticed
`;

function mapTechnique(raw: {
  id: string;
  name: string;
  position: string;
  category: string;
  level: string;
  tags: string[];
  notes: string | null;
  timesPracticed: number;
  lastPracticed: string | null;
}): Technique {
  return {
    id: raw.id,
    name: raw.name,
    position: raw.position,
    category: raw.category as TechniqueCategory,
    level: raw.level as TechniqueLevel,
    tags: raw.tags ?? [],
    notes: raw.notes ?? undefined,
    timesPracticed: raw.timesPracticed,
    lastPracticed: raw.lastPracticed ?? undefined,
  };
}

function mapSessionLog(raw: {
  id: string;
  date: string;
  giType: string;
  sessionType: string;
  techniquesPracticed: string[];
  notes: string;
  rollNotes: SessionLog["rollNotes"];
}): SessionLog {
  return {
    id: raw.id,
    date: raw.date,
    giType: raw.giType as SessionLog["giType"],
    sessionType: raw.sessionType as SessionLog["sessionType"],
    techniquesPracticed: raw.techniquesPracticed ?? [],
    notes: raw.notes,
    rollNotes: raw.rollNotes ?? undefined,
  };
}

export async function apiFetchTechniques(): Promise<Technique[]> {
  const data = await graphqlRequest<{ techniques: Parameters<typeof mapTechnique>[0][] }>(
    `query { techniques { ${TECHNIQUE_FIELDS} } }`,
  );
  return data.techniques.map(mapTechnique);
}

export async function apiFetchSessionLogs(): Promise<SessionLog[]> {
  const data = await graphqlRequest<{
    sessionLogs: {
      id: string;
      date: string;
      giType: string;
      sessionType: string;
      techniquesPracticed: string[];
      notes: string;
      rollNotes: SessionLog["rollNotes"];
    }[];
  }>(`
    query {
      sessionLogs {
        id
        date
        giType
        sessionType
        techniquesPracticed
        notes
        rollNotes { partner rounds notes }
      }
    }
  `);
  return data.sessionLogs.map(mapSessionLog);
}

export async function apiLoadAll(): Promise<{ techniques: Technique[]; sessionLogs: SessionLog[] }> {
  const [techniques, sessionLogs] = await Promise.all([apiFetchTechniques(), apiFetchSessionLogs()]);
  return { techniques, sessionLogs };
}

export async function apiCreateSessionLog(input: Omit<SessionLog, "id">): Promise<void> {
  await graphqlRequest(
    `
    mutation($input: CreateSessionLogInput!) {
      createSessionLog(input: $input) { id }
    }
  `,
    {
      input: {
        date: input.date,
        giType: input.giType,
        sessionType: input.sessionType,
        techniquesPracticed: input.techniquesPracticed,
        notes: input.notes,
        rollNotes: input.rollNotes ?? null,
      },
    },
  );
}

export async function apiCreateTechnique(input: {
  name: string;
  position: string;
  category: string;
  level: string;
  tags: string[];
  notes?: string;
}): Promise<Technique> {
  const data = await graphqlRequest<{ createTechnique: Parameters<typeof mapTechnique>[0] }>(
    `
    mutation($input: CreateTechniqueInput!) {
      createTechnique(input: $input) { ${TECHNIQUE_FIELDS} }
    }
  `,
    { input: { ...input, tags: input.tags, notes: input.notes ?? null } },
  );
  return mapTechnique(data.createTechnique);
}

export async function apiUpdateTechnique(
  id: string,
  input: Partial<{
    name: string;
    position: string;
    category: string;
    level: string;
    tags: string[];
    notes: string | null;
  }>,
): Promise<Technique> {
  const data = await graphqlRequest<{ updateTechnique: Parameters<typeof mapTechnique>[0] }>(
    `
    mutation($id: ID!, $input: UpdateTechniqueInput!) {
      updateTechnique(id: $id, input: $input) { ${TECHNIQUE_FIELDS} }
    }
  `,
    { id, input },
  );
  return mapTechnique(data.updateTechnique);
}

export async function apiDeleteTechnique(id: string): Promise<void> {
  await graphqlRequest<{ deleteTechnique: boolean }>(
    `mutation DeleteTechnique($id: ID!) { deleteTechnique(id: $id) }`,
    { id },
  );
}
