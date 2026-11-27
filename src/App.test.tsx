import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { App } from "./App";

describe("application routes", () => {
  it("opens the dashboard at the root route", () => {
    window.history.pushState({}, "", "/");
    render(<App />);
    expect(screen.getByRole("heading", { name: "认识五笔键盘" })).toBeInTheDocument();
  });

  it("navigates to the lessons placeholder without a page reload", () => {
    window.history.pushState({}, "", "/");
    render(<App />);
    fireEvent.click(screen.getByRole("link", { name: "课程学习" }));
    expect(screen.getByRole("heading", { name: "课程学习" })).toBeInTheDocument();
    expect(window.location.pathname).toBe("/lessons");
  });

  it("opens the keyboard recognition exercise route", () => {
    window.history.pushState({}, "", "/practice");
    render(<App />);
    expect(screen.getByRole("heading", { name: "键名找键位" })).toBeInTheDocument();
  });

  it("shows a useful fallback for unknown routes", () => {
    window.history.pushState({}, "", "/unknown-page");
    render(<App />);
    expect(screen.getByRole("heading", { name: "页面不存在" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "返回学习首页" })).toBeInTheDocument();
  });
});
