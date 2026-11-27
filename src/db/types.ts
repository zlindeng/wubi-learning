export type LearningStatus = "not_started" | "learning" | "review" | "mastered";

export interface LearningProgress {
  lessonId: string;
  status: LearningStatus;
  startedAt?: number;
  completedAt?: number;
  updatedAt: number;
}

export interface ExerciseAttempt {
  id?: number;
  exerciseId: string;
  lessonId?: string;
  submittedAnswer: string;
  isCorrect: boolean;
  answeredAt: number;
}

export interface MistakeRecord {
  exerciseId: string;
  firstWrongAt: number;
  lastWrongAt: number;
  wrongCount: number;
  lastSubmittedAnswer: string;
  resolvedAt?: number;
}

export interface AppSetting<T = unknown> {
  key: string;
  value: T;
  updatedAt: number;
}
