import { describe, expect, it } from "vitest";
import {
  centisecondsKey,
  digitKey,
  formatStopwatchCopyTime,
  formatStopwatchDisplayTime,
  toggleLabel,
} from "../stopwatchDisplay";

describe("formatStopwatchDisplayTime", () => {
  it("shows zero as all zeros", () => {
    expect(formatStopwatchDisplayTime(0)).toEqual({
      minutes: "00",
      seconds: "00",
      centiseconds: "00",
    });
  });

  it("splits elapsed time into padded minutes, seconds and centiseconds", () => {
    expect(formatStopwatchDisplayTime(61_234)).toEqual({
      minutes: "01",
      seconds: "01",
      centiseconds: "23",
    });
  });

  it("drops the last millisecond digit instead of rounding", () => {
    expect(formatStopwatchDisplayTime(59_999)).toEqual({
      minutes: "00",
      seconds: "59",
      centiseconds: "99",
    });
  });

  it("keeps counting minutes past an hour", () => {
    expect(formatStopwatchDisplayTime(3_605_000).minutes).toBe("60");
  });
});

describe("formatStopwatchCopyTime", () => {
  it("formats minutes, seconds and padded milliseconds", () => {
    expect(formatStopwatchCopyTime(61_234)).toBe("01:01.234");
  });

  it("pads small values", () => {
    expect(formatStopwatchCopyTime(0)).toBe("00:00.000");
    expect(formatStopwatchCopyTime(5)).toBe("00:00.005");
  });
});

describe("toggleLabel", () => {
  it("offers to stop while running and to start while paused", () => {
    expect(toggleLabel(true)).toBe("Stop");
    expect(toggleLabel(false)).toBe("Start");
  });
});

describe("digitKey", () => {
  it("marks a digit after a paused reset", () => {
    expect(digitKey("07", true, false)).toBe("07-reset");
  });

  it("keeps the plain value while running or without a reset", () => {
    expect(digitKey("07", true, true)).toBe("07");
    expect(digitKey("07", false, false)).toBe("07");
  });
});

describe("centisecondsKey", () => {
  it("tells a reset apart from an idle value", () => {
    expect(centisecondsKey("42", true)).toBe("42-reset");
    expect(centisecondsKey("42", false)).toBe("42-idle");
  });
});
