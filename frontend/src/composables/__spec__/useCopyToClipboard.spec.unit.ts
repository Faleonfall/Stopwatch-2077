import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { COPY_COOLDOWN_MS } from "../../lib/stopwatchTimings";
import { useCopyToClipboard } from "../useCopyToClipboard";

describe("useCopyToClipboard", () => {
  const writeText = vi.fn<(text: string) => Promise<void>>();

  beforeEach(() => {
    vi.useFakeTimers();
    writeText.mockReset().mockResolvedValue(undefined);
    vi.stubGlobal("navigator", { clipboard: { writeText } });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("writes the text and counts the copy", async () => {
    const { copy, copyTrigger } = useCopyToClipboard();

    await copy("00:01.234");

    expect(writeText).toHaveBeenCalledWith("00:01.234");
    expect(copyTrigger.value).toBe(1);
  });

  it("ignores copies during the cooldown", async () => {
    const { copy, copyTrigger } = useCopyToClipboard();

    await copy("first");
    await copy("second");
    expect(writeText).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(COPY_COOLDOWN_MS);
    await copy("third");

    expect(writeText).toHaveBeenCalledTimes(2);
    expect(writeText).toHaveBeenLastCalledWith("third");
    expect(copyTrigger.value).toBe(2);
  });

  it("leaves the trigger alone when the clipboard is denied", async () => {
    writeText.mockRejectedValue(new Error("denied"));
    const { copy, copyTrigger } = useCopyToClipboard();

    await copy("00:01.234");

    expect(copyTrigger.value).toBe(0);
  });
});
