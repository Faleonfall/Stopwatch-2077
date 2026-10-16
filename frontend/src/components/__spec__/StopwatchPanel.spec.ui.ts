import { fireEvent, render, screen } from "@testing-library/vue";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import StopwatchPanel from "../StopwatchPanel.vue";

describe("stopwatch tab order", () => {
  const originalInnerWidth = window.innerWidth;

  beforeEach(() => {
    Object.defineProperty(window, "innerWidth", {
      configurable: true,
      writable: true,
      value: 1440,
    });
  });

  afterEach(() => {
    Object.defineProperty(window, "innerWidth", {
      configurable: true,
      writable: true,
      value: originalInnerWidth,
    });
    vi.restoreAllMocks();
  });

  it("renders focusable desktop controls in Start, Reset, Help order", () => {
    render(StopwatchPanel);

    const labels = screen
      .getAllByRole("button")
      .map((button) => button.textContent?.trim());

    expect(labels).toEqual(["Start", "Reset", "?"]);
  });
});

describe("stopwatch controls", () => {
  it("switches between Start and Stop on click", async () => {
    render(StopwatchPanel);

    await fireEvent.click(screen.getByRole("button", { name: "Start" }));
    expect(screen.getByRole("button", { name: "Stop" })).toBeInTheDocument();

    await fireEvent.click(screen.getByRole("button", { name: "Stop" }));
    expect(screen.getByRole("button", { name: "Start" })).toBeInTheDocument();
  });

  it("toggles with Space", async () => {
    render(StopwatchPanel);

    await fireEvent.keyDown(window, { key: " ", code: "Space" });

    expect(screen.getByRole("button", { name: "Stop" })).toBeInTheDocument();
  });

  it("ignores a held Space", async () => {
    render(StopwatchPanel);

    await fireEvent.keyDown(window, { key: " ", code: "Space", repeat: true });

    expect(screen.getByRole("button", { name: "Start" })).toBeInTheDocument();
  });
});
