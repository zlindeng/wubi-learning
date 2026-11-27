import { db } from "../db/database";
import type { MistakeRecord } from "../db/types";

export const mistakeRepository = {
  async recordWrongAnswer(
    exerciseId: string,
    submittedAnswer: string,
    answeredAt = Date.now(),
  ): Promise<MistakeRecord> {
    return db.transaction("rw", db.mistakes, async () => {
      const existing = await db.mistakes.get(exerciseId);
      const next: MistakeRecord = existing
        ? {
            exerciseId,
            firstWrongAt: existing.firstWrongAt,
            lastWrongAt: answeredAt,
            wrongCount: existing.wrongCount + 1,
            lastSubmittedAnswer: submittedAnswer,
          }
        : {
            exerciseId,
            firstWrongAt: answeredAt,
            lastWrongAt: answeredAt,
            wrongCount: 1,
            lastSubmittedAnswer: submittedAnswer,
          };

      await db.mistakes.put(next);
      return next;
    });
  },

  async resolve(exerciseId: string, resolvedAt = Date.now()): Promise<boolean> {
    const existing = await db.mistakes.get(exerciseId);
    if (!existing) return false;

    await db.mistakes.put({ ...existing, resolvedAt });
    return true;
  },

  listUnresolved(): Promise<MistakeRecord[]> {
    return db.mistakes.filter((mistake) => mistake.resolvedAt === undefined).toArray();
  },
};
