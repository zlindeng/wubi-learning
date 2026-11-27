import { beforeEach, describe, expect, it } from "vitest";
import { usePracticeSessionStore } from "./practiceSessionStore";

const initialState = usePracticeSessionStore.getState();

beforeEach(() => {
  initialState.clearSession();
});

describe("practice session store", () => {
  it("starts a fresh session for an exercise", () => {
    usePracticeSessionStore.getState().startSession("exercise-01", 100);

    expect(usePracticeSessionStore.getState().session).toEqual({
      exerciseId: "exercise-01",
      status: "active",
      currentInput: "",
      startedAt: 100,
    });
  });

  it("updates input only while a session is active", () => {
    const store = usePracticeSessionStore.getState();

    store.updateInput("A");
    expect(usePracticeSessionStore.getState().session).toBeNull();

    store.startSession("exercise-01", 100);
    usePracticeSessionStore.getState().updateInput("AB");

    expect(usePracticeSessionStore.getState().session?.currentInput).toBe("AB");
  });

  it("completes an active session and ignores later input", () => {
    usePracticeSessionStore.getState().startSession("exercise-01", 100);
    usePracticeSessionStore.getState().updateInput("AB");
    usePracticeSessionStore.getState().completeSession(200);
    usePracticeSessionStore.getState().updateInput("ABC");

    expect(usePracticeSessionStore.getState().session).toEqual({
      exerciseId: "exercise-01",
      status: "completed",
      currentInput: "AB",
      startedAt: 100,
      completedAt: 200,
    });
  });

  it("clears a session and can start another one", () => {
    usePracticeSessionStore.getState().startSession("exercise-01", 100);
    usePracticeSessionStore.getState().clearSession();
    usePracticeSessionStore.getState().startSession("exercise-02", 300);

    expect(usePracticeSessionStore.getState().session?.exerciseId).toBe("exercise-02");
    expect(usePracticeSessionStore.getState().session?.currentInput).toBe("");
  });

  it("does not complete a missing or already completed session", () => {
    usePracticeSessionStore.getState().completeSession(200);
    expect(usePracticeSessionStore.getState().session).toBeNull();

    usePracticeSessionStore.getState().startSession("exercise-01", 100);
    usePracticeSessionStore.getState().completeSession(200);
    usePracticeSessionStore.getState().completeSession(300);

    expect(usePracticeSessionStore.getState().session?.completedAt).toBe(200);
  });
});
