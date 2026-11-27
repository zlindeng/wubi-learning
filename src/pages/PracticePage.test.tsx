import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { PracticePage } from "./PracticePage";
import { keyboardKeys } from "../data/keyboard";
import { db } from "../db/database";
import { attemptRepository, mistakeRepository, progressRepository } from "../repositories";

describe("PracticePage", () => {
  beforeEach(async () => {
    await Promise.all([
      db.exerciseAttempts.clear(),
      db.mistakes.clear(),
      db.lessonProgress.clear(),
    ]);
  });

  it("accepts the physical key code for the displayed key name and saves progress", async () => {
    render(<PracticePage />);

    const keyName = screen.getByText(
      (content, element) => element?.tagName === "STRONG" && keyboardKeys.some((key) => key.keyName === content),
    ).textContent;
    const expectedKey = keyboardKeys.find((key) => key.keyName === keyName);
    expect(expectedKey).toBeDefined();

    const practiceArea = screen.getByRole("region", { name: "五笔键位认知练习" });
    fireEvent.keyDown(practiceArea, { code: `Key${expectedKey!.key}`, key: expectedKey!.key.toLowerCase() });

    expect(await screen.findByText("正确！")).toBeInTheDocument();
    await waitFor(async () => {
      const progress = await progressRepository.get("keyboard-key-recognition");
      expect(progress?.status).toBe("learning");
      expect(screen.getByText("1 / 25")).toBeInTheDocument();
    });
  });

  it("records a wrong key as a mistake", async () => {
    render(<PracticePage />);
    const keyName = screen.getByText(
      (content, element) => element?.tagName === "STRONG" && keyboardKeys.some((key) => key.keyName === content),
    ).textContent;
    const expectedKey = keyboardKeys.find((key) => key.keyName === keyName)!;
    const wrongKey = keyboardKeys.find((key) => key.key !== expectedKey.key)!;
    fireEvent.keyDown(screen.getByRole("region", { name: "五笔键位认知练习" }), {
      code: `Key${wrongKey.key}`,
      key: wrongKey.key.toLowerCase(),
    });

    expect(await screen.findByText("再记一下")).toBeInTheDocument();
    await waitFor(async () => {
      const mistakes = await mistakeRepository.listUnresolved();
      expect(mistakes).toHaveLength(1);
      expect(mistakes[0].exerciseId).toBe(`keyboard-key:${expectedKey.key}`);
    });
  });

  it("restores the number of correctly recognized keys after remount", async () => {
    await attemptRepository.record({
      exerciseId: "keyboard-key:G",
      lessonId: "keyboard-key-recognition",
      submittedAnswer: "G",
      isCorrect: true,
      answeredAt: Date.now(),
    });

    render(<PracticePage />);
    await waitFor(() => {
      expect(screen.getByText("1 / 25")).toBeInTheDocument();
    });
  });

  it("accepts physical key codes even when an input method is composing", async () => {
    render(<PracticePage />);
    const keyName = screen.getByText(
      (content, element) => element?.tagName === "STRONG" && keyboardKeys.some((key) => key.keyName === content),
    ).textContent;
    const expectedKey = keyboardKeys.find((key) => key.keyName === keyName)!;

    fireEvent.keyDown(window, {
      code: `Key${expectedKey.key}`,
      key: expectedKey.key.toLowerCase(),
      isComposing: true,
    });

    expect(await screen.findByText("正确！")).toBeInTheDocument();
  });

  it("receives keyboard input without requiring focus on the practice card", async () => {
    render(<PracticePage />);
    const keyName = screen.getByText(
      (content, element) => element?.tagName === "STRONG" && keyboardKeys.some((key) => key.keyName === content),
    ).textContent;
    const expectedKey = keyboardKeys.find((key) => key.keyName === keyName)!;

    fireEvent.keyDown(window, {
      code: `Key${expectedKey.key}`,
      key: expectedKey.key.toLowerCase(),
    });

    expect(await screen.findByText("正确！")).toBeInTheDocument();
  });

  it("does not capture typing inside editable controls", () => {
    render(<PracticePage />);
    const input = document.createElement("input");
    document.body.append(input);

    fireEvent.keyDown(input, { code: "KeyA", key: "a" });

    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    input.remove();
  });
});
