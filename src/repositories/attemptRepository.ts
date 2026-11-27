import { db } from "../db/database";
import type { ExerciseAttempt } from "../db/types";

export const attemptRepository = {
  record(attempt: ExerciseAttempt): Promise<number> {
    return db.exerciseAttempts.add(attempt);
  },

  listByExercise(exerciseId: string): Promise<ExerciseAttempt[]> {
    return db.exerciseAttempts
      .where("exerciseId")
      .equals(exerciseId)
      .sortBy("answeredAt");
  },

  listRecent(limit = 20): Promise<ExerciseAttempt[]> {
    return db.exerciseAttempts.orderBy("answeredAt").reverse().limit(limit).toArray();
  },
};
