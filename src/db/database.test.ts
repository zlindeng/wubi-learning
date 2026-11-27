import { afterEach, describe, expect, it } from "vitest";
import { db } from "./database";
import {
  attemptRepository,
  mistakeRepository,
  progressRepository,
  settingsRepository,
} from "../repositories";

afterEach(async () => {
  await db.delete();
});

describe("local repositories", () => {
  it("creates, reads, filters, and removes lesson progress", async () => {
    await progressRepository.save({
      lessonId: "lesson-01",
      status: "learning",
      startedAt: 100,
      updatedAt: 200,
    });
    await progressRepository.save({
      lessonId: "lesson-02",
      status: "mastered",
      completedAt: 300,
      updatedAt: 300,
    });

    await expect(progressRepository.get("lesson-01")).resolves.toMatchObject({
      status: "learning",
    });
    await expect(progressRepository.listByStatus("mastered")).resolves.toHaveLength(1);

    await progressRepository.remove("lesson-01");
    await expect(progressRepository.get("lesson-01")).resolves.toBeUndefined();
  });

  it("stores attempts and queries them by exercise and recency", async () => {
    await attemptRepository.record({
      exerciseId: "exercise-01",
      submittedAnswer: "A",
      isCorrect: false,
      answeredAt: 100,
    });
    await attemptRepository.record({
      exerciseId: "exercise-01",
      submittedAnswer: "B",
      isCorrect: true,
      answeredAt: 200,
    });
    await attemptRepository.record({
      exerciseId: "exercise-02",
      submittedAnswer: "C",
      isCorrect: true,
      answeredAt: 300,
    });

    await expect(attemptRepository.listByExercise("exercise-01")).resolves.toHaveLength(2);
    await expect(attemptRepository.listRecent(2)).resolves.toMatchObject([
      { exerciseId: "exercise-02" },
      { exerciseId: "exercise-01", answeredAt: 200 },
    ]);
  });

  it("aggregates repeated wrong answers and supports review resolution", async () => {
    await mistakeRepository.recordWrongAnswer("exercise-01", "A", 100);
    const updated = await mistakeRepository.recordWrongAnswer("exercise-01", "B", 200);

    expect(updated).toMatchObject({
      exerciseId: "exercise-01",
      firstWrongAt: 100,
      lastWrongAt: 200,
      wrongCount: 2,
      lastSubmittedAnswer: "B",
    });
    await expect(mistakeRepository.listUnresolved()).resolves.toHaveLength(1);
    await expect(mistakeRepository.resolve("exercise-01", 300)).resolves.toBe(true);
    await expect(mistakeRepository.listUnresolved()).resolves.toHaveLength(0);
    await expect(mistakeRepository.resolve("missing")).resolves.toBe(false);
  });

  it("stores and removes typed local settings", async () => {
    await settingsRepository.set("keyboard-sound", false);
    await expect(settingsRepository.get<boolean>("keyboard-sound")).resolves.toBe(false);

    await settingsRepository.remove("keyboard-sound");
    await expect(settingsRepository.get("keyboard-sound")).resolves.toBeUndefined();
  });
});
