import { db } from "../db/database";
import type { LearningProgress, LearningStatus } from "../db/types";

export const progressRepository = {
  get(lessonId: string): Promise<LearningProgress | undefined> {
    return db.lessonProgress.get(lessonId);
  },

  save(progress: LearningProgress): Promise<string> {
    return db.lessonProgress.put(progress);
  },

  listByStatus(status: LearningStatus): Promise<LearningProgress[]> {
    return db.lessonProgress.where("status").equals(status).sortBy("updatedAt");
  },

  remove(lessonId: string): Promise<void> {
    return db.lessonProgress.delete(lessonId);
  },
};
