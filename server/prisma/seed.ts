import { PrismaClient } from "@prisma/client";
import { sessionLogs, techniques } from "@rolltrack/shared";

const prisma = new PrismaClient();

async function main() {
  await prisma.sessionLog.deleteMany();
  await prisma.technique.deleteMany();

  for (const tech of techniques) {
    await prisma.technique.create({
      data: {
        id: tech.id,
        name: tech.name,
        position: tech.position,
        category: tech.category,
        level: tech.level,
        tags: tech.tags,
        notes: tech.notes ?? null,
        timesPracticed: tech.timesPracticed,
        lastPracticed: tech.lastPracticed ?? null,
      },
    });
  }

  for (const log of sessionLogs) {
    await prisma.sessionLog.create({
      data: {
        id: log.id,
        date: log.date,
        giType: log.giType,
        sessionType: log.sessionType,
        notes: log.notes,
        techniquesPracticed: log.techniquesPracticed,
        rollNotes: log.rollNotes ?? null,
      },
    });
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
