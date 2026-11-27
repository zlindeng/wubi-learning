import { create } from "zustand";

export type PracticeSessionStatus = "active" | "completed";

export interface PracticeSession {
  exerciseId: string;
  status: PracticeSessionStatus;
  currentInput: string;
  startedAt: number;
  completedAt?: number;
}

interface PracticeSessionState {
  session: PracticeSession | null;
  startSession: (exerciseId: string, startedAt?: number) => void;
  updateInput: (currentInput: string) => void;
  completeSession: (completedAt?: number) => void;
  clearSession: () => void;
}

export const usePracticeSessionStore = create<PracticeSessionState>((set) => ({
  session: null,

  startSession: (exerciseId, startedAt = Date.now()) => {
    set({
      session: {
        exerciseId,
        status: "active",
        currentInput: "",
        startedAt,
      },
    });
  },

  updateInput: (currentInput) => {
    set((state) => {
      if (!state.session || state.session.status !== "active") return state;

      return {
        session: {
          ...state.session,
          currentInput,
        },
      };
    });
  },

  completeSession: (completedAt = Date.now()) => {
    set((state) => {
      if (!state.session || state.session.status !== "active") return state;

      return {
        session: {
          ...state.session,
          status: "completed",
          completedAt,
        },
      };
    });
  },

  clearSession: () => set({ session: null }),
}));
