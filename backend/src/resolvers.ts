import { Prisma } from "@prisma/client";
import type { SessionLog as PrismaSessionLog, Technique as PrismaTechnique } from "@prisma/client";
import { prisma } from "./prisma.js";

function asStringArray(value: Prisma.JsonValue): string[] {
  if (Array.isArray(value) && value.every((x) => typeof x === "string")) {
    return value as string[];
  }
  return [];
}

function asRollNotes(value: Prisma.JsonValue | null | undefined): Array<{ partner: string; rounds: number; notes: string }> | null {
  if (value === null || value === undefined) return null;
  if (!Array.isArray(value)) return null;
  return value as Array<{ partner: string; rounds: number; notes: string }>;
}

type CreateSessionLogInput = {
  date: string;
  giType: string;
  sessionType: string;
  techniquesPracticed: string[];
  notes: string;
  rollNotes?: Array<{ partner: string; rounds: number; notes: string }> | null;
};

export const resolvers = {
  Query: {
    health: () => "ok",
    techniques: () => prisma.technique.findMany({ orderBy: { name: "asc" } }),
    sessionLogs: () =>
      prisma.sessionLog.findMany({
        orderBy: [{ date: "desc" }, { id: "desc" }],
      }),
    technique: (_: unknown, args: { id: string }) =>
      prisma.technique.findUnique({ where: { id: args.id } }),
  },

  Technique: {
    tags: (parent: PrismaTechnique) => asStringArray(parent.tags),
  },

  SessionLog: {
    techniquesPracticed: (parent: PrismaSessionLog) => asStringArray(parent.techniquesPracticed),
    rollNotes: (parent: PrismaSessionLog) => asRollNotes(parent.rollNotes),
  },

  Mutation: {
    createSessionLog: async (_: unknown, args: { input: CreateSessionLogInput }) => {
      const id = `session-${Date.now()}`;
      const sessionDate = args.input.date;
      const practiced = args.input.techniquesPracticed;

      await prisma.$transaction(async (tx) => {
        await tx.sessionLog.create({
          data: {
            id,
            date: args.input.date,
            giType: args.input.giType,
            sessionType: args.input.sessionType,
            notes: args.input.notes,
            techniquesPracticed: practiced,
            rollNotes:
              args.input.rollNotes === undefined || args.input.rollNotes === null
                ? Prisma.JsonNull
                : args.input.rollNotes,
          },
        });

        for (const tid of practiced) {
          const tech = await tx.technique.findUnique({ where: { id: tid } });
          if (!tech) continue;
          const nextLast =
            !tech.lastPracticed || tech.lastPracticed < sessionDate ? sessionDate : tech.lastPracticed;
          await tx.technique.update({
            where: { id: tid },
            data: {
              timesPracticed: { increment: 1 },
              lastPracticed: nextLast,
            },
          });
        }
      });

      return prisma.sessionLog.findUniqueOrThrow({ where: { id } });
    },
  },
};
