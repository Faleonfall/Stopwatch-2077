import { mount } from "@vue/test-utils";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import Stopwatch from "../src/components/Stopwatch.vue";

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
    const wrapper = mount(Stopwatch);

    const focusables = wrapper
      .findAll("button")
      .map((button) => button.text().trim())
      .filter(Boolean);

    expect(focusables).toEqual(["Start", "Reset", "?"]);
  });
});
