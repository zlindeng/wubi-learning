import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Keyboard } from "./Keyboard";
import { keyboardKeys } from "../data/keyboard";

describe("86 keyboard", () => {
  it("contains 25 verified root-key positions", () => {
    expect(keyboardKeys).toHaveLength(25);
    expect(new Set(keyboardKeys.map(({ key }) => key)).size).toBe(25);
    expect(keyboardKeys.some(({ key }) => key === "Z")).toBe(false);
  });

  it("shows the selected key name and area", () => {
    render(<Keyboard />);
    fireEvent.click(screen.getByRole("button", { name: "G 键，键名 王，横区" }));
    expect(screen.getByText("王 · 横区")).toBeInTheDocument();
  });

  it("selects a key with Shift plus its physical letter key", () => {
    render(<Keyboard />);
    fireEvent.keyDown(window, { code: "KeyG", key: "G", shiftKey: true });
    expect(screen.getByText("王 · 横区")).toBeInTheDocument();
  });

  it("notifies the parent when a key is selected", () => {
    const onSelectKey = vi.fn();
    render(<Keyboard onSelectKey={onSelectKey} />);
    fireEvent.click(screen.getByRole("button", { name: "H 键，键名 目，竖区" }));
    expect(onSelectKey).toHaveBeenCalledWith(
      expect.objectContaining({ key: "H", keyName: "目" }),
    );
  });
});
