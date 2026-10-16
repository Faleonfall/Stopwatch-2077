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

// jsdom never animates, so a fade ends two frames after it starts. Until then
// the leaving digit carries the leave class.
describe("digit transitions", () => {
  const FADE_SETTLE_MS = 400;

  function digitSpans() {
    return [
      ...document.querySelectorAll(
        ".stopwatch-time span:not(.stopwatch-colon)",
      ),
    ];
  }

  function shownDigits() {
    return digitSpans().map((span) => span.textContent?.trim());
  }

  function fadingDigits() {
    return digitSpans()
      .filter((span) => span.classList.contains("digit-fade-leave-active"))
      .map((span) => span.textContent?.trim());
  }

  // Test utils stub transitions by default, which would hide every fade.
  function renderWithFades() {
    render(StopwatchPanel, { global: { stubs: { transition: false } } });
  }

  function click(name: string) {
    return fireEvent.click(screen.getByRole("button", { name }));
  }

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("fades the seconds on a tick and keeps the centiseconds instant", async () => {
    renderWithFades();

    await click("Start");
    await vi.advanceTimersByTimeAsync(990);
    expect(fadingDigits()).toEqual([]);

    await vi.advanceTimersByTimeAsync(10);
    expect(fadingDigits()).toEqual(["00"]);

    await vi.advanceTimersByTimeAsync(FADE_SETTLE_MS);
    expect(fadingDigits()).toEqual([]);
    expect(shownDigits()).toEqual(["00", "01", "40"]);
  });

  it("snaps every digit to zero on a reset while running", async () => {
    renderWithFades();

    await click("Start");
    await vi.advanceTimersByTimeAsync(1_500);
    await click("Reset");

    expect(fadingDigits()).toEqual([]);
    expect(shownDigits()).toEqual(["00", "00", "00"]);
  });

  it("snaps to zero on a reset while running even mid-fade", async () => {
    renderWithFades();

    await click("Start");
    await vi.advanceTimersByTimeAsync(1_000);
    expect(fadingDigits()).toEqual(["00"]);

    await click("Reset");

    expect(fadingDigits()).toEqual([]);
    expect(shownDigits()).toEqual(["00", "00", "00"]);
  });

  it("keeps the digits still on stop", async () => {
    renderWithFades();

    await click("Start");
    await vi.advanceTimersByTimeAsync(1_500);
    await click("Stop");

    expect(fadingDigits()).toEqual([]);
    expect(shownDigits()).toEqual(["00", "01", "50"]);
  });

  it("fades every digit on a reset while paused, even one that stays zero", async () => {
    renderWithFades();

    await click("Start");
    await vi.advanceTimersByTimeAsync(1_500);
    await click("Stop");
    await click("Reset");

    expect(fadingDigits()).toEqual(["00", "01", "50"]);

    await vi.advanceTimersByTimeAsync(FADE_SETTLE_MS);
    expect(fadingDigits()).toEqual([]);
    expect(shownDigits()).toEqual(["00", "00", "00"]);

    await click("Reset");
    expect(fadingDigits()).toEqual(["00", "00", "00"]);
  });
});
