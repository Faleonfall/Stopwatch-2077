import { nextTick } from "vue";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { RESET_FADE_MS } from "../../lib/stopwatchTimings";
import { useStopwatch } from "../useStopwatch";
import { withSetup } from "./composableHelpers";

function digits(stopwatch: ReturnType<typeof useStopwatch>) {
  return [
    stopwatch.formattedMinutes.value,
    stopwatch.formattedSeconds.value,
    stopwatch.formattedCentiseconds.value,
  ];
}

describe("useStopwatch", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("starts stopped at zero", () => {
    const stopwatch = withSetup(useStopwatch);

    expect(stopwatch.isRunning.value).toBe(false);
    expect(digits(stopwatch)).toEqual(["00", "00", "00"]);
  });

  it("counts elapsed time while running", () => {
    const stopwatch = withSetup(useStopwatch);

    stopwatch.toggle();
    vi.advanceTimersByTime(61_230);

    expect(stopwatch.isRunning.value).toBe(true);
    expect(digits(stopwatch)).toEqual(["01", "01", "23"]);
  });

  it("holds the time while stopped and resumes from it", () => {
    const stopwatch = withSetup(useStopwatch);

    stopwatch.toggle();
    vi.advanceTimersByTime(1_000);
    stopwatch.toggle();
    vi.advanceTimersByTime(5_000);
    expect(digits(stopwatch)).toEqual(["00", "01", "00"]);

    stopwatch.toggle();
    vi.advanceTimersByTime(500);
    expect(digits(stopwatch)).toEqual(["00", "01", "50"]);
  });

  it("resets to zero while stopped and fades the digits once", async () => {
    const stopwatch = withSetup(useStopwatch);

    stopwatch.toggle();
    vi.advanceTimersByTime(2_000);
    stopwatch.toggle();
    stopwatch.reset();

    expect(digits(stopwatch)).toEqual(["00", "00", "00"]);
    expect(stopwatch.justReset.value).toBe(true);
    expect(stopwatch.minutesKey.value).toBe("00-reset");
    expect(stopwatch.centisecondsKey.value).toBe("00-reset");

    await nextTick();
    vi.advanceTimersByTime(RESET_FADE_MS);

    expect(stopwatch.justReset.value).toBe(false);
    expect(stopwatch.minutesKey.value).toBe("00");
  });

  it("keeps running from zero after a reset while running", () => {
    const stopwatch = withSetup(useStopwatch);

    stopwatch.toggle();
    vi.advanceTimersByTime(3_000);
    stopwatch.reset();
    vi.advanceTimersByTime(250);

    expect(stopwatch.isRunning.value).toBe(true);
    expect(digits(stopwatch)).toEqual(["00", "00", "25"]);
  });

  it("copies the exact time, milliseconds included", () => {
    const stopwatch = withSetup(useStopwatch);

    stopwatch.toggle();
    vi.advanceTimersByTime(1_234);

    expect(stopwatch.getCopyTime()).toBe("00:01.234");
  });
});
