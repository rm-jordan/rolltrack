import { beforeEach, describe, expect, it, vi } from "vitest";

const { prismaMock } = vi.hoisted(() => ({
  prismaMock: {
    $transaction: vi.fn(),
    technique: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
      create: vi.fn(),
      delete: vi.fn(),
    },
    sessionLog: {
      findMany: vi.fn(),
      findUniqueOrThrow: vi.fn(),
      create: vi.fn(),
    },
  },
}));

vi.mock("../lib/prisma.js", () => ({
  prisma: prismaMock,
}));

import { resolvers } from "./index.js";

describe("server resolvers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns health status", () => {
    expect(resolvers.Query.health()).toBe("ok");
  });

  it("normalizes Technique.tags to string array", () => {
    expect(resolvers.Technique.tags({ tags: ["a", "b"] } as never)).toEqual(["a", "b"]);
    expect(resolvers.Technique.tags({ tags: ["a", 1] } as never)).toEqual([]);
  });

  it("normalizes SessionLog.rollNotes shape", () => {
    const notes = [{ partner: "A", rounds: 3, notes: "good rounds" }];
    expect(resolvers.SessionLog.rollNotes({ rollNotes: notes } as never)).toEqual(notes);
    expect(resolvers.SessionLog.rollNotes({ rollNotes: null } as never)).toBeNull();
    expect(resolvers.SessionLog.rollNotes({ rollNotes: "bad" } as never)).toBeNull();
  });

  it("passes expected update payload in updateTechnique mutation", async () => {
    prismaMock.technique.update.mockResolvedValueOnce({ id: "tech-1" });

    await resolvers.Mutation.updateTechnique(
      {},
      {
        id: "tech-1",
        input: {
          name: "Guard Retention",
          tags: null,
          notes: "drill daily",
          position: null,
        },
      },
    );

    expect(prismaMock.technique.update).toHaveBeenCalledWith({
      where: { id: "tech-1" },
      data: {
        name: "Guard Retention",
        tags: [],
        notes: "drill daily",
      },
    });
  });
});
