import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { PracticePage } from "./PracticePage";
import { keyboardKeys } from "../data/keyboard";
import { db } from "../db/database";
import { progressRepository } from "../repositories";

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

  it("does not treat input-method composition as an answer", () => {
    render(<PracticePage />);
    const practiceArea = screen.getByRole("region", { name: "五笔键位认知练习" });
    fireEvent.keyDown(practiceArea, {
      code: "KeyA",
      key: "a",
      isComposing: true,
    });
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });
});
