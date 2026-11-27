import Dexie, { type Table } from "dexie";
import type {
  AppSetting,
  ExerciseAttempt,
  LearningProgress,
  MistakeRecord,
} from "./types";

export class WubiDatabase extends Dexie {
  lessonProgress!: Table<LearningProgress, string>;
  exerciseAttempts!: Table<ExerciseAttempt, number>;
  mistakes!: Table<MistakeRecord, string>;
  settings!: Table<AppSetting, string>;

  constructor() {
    super("wubi-learning");

    this.version(1).stores({
      lessonProgress: "&lessonId,status,updatedAt",
      exerciseAttempts: "++id,exerciseId,lessonId,answeredAt,isCorrect",
      mistakes: "&exerciseId,lastWrongAt,wrongCount,resolvedAt",
      settings: "&key,updatedAt",
    });
  }
}

export const db = new WubiDatabase();
