import { describe, expect, it } from "vitest";
import { isTypingTarget, shortcutFor } from "../keyboardShortcuts";

function press(key: string, code = "", repeat = false) {
  return shortcutFor({ key, code, repeat });
}

describe("shortcutFor", () => {
  it("toggles on Space, by code or by key", () => {
    expect(press(" ", "Space")).toBe("toggle");
    expect(press(" ")).toBe("toggle");
  });

  it("resets on R in either case", () => {
    expect(press("r")).toBe("reset");
    expect(press("R")).toBe("reset");
  });

  it("copies on C in either case", () => {
    expect(press("c")).toBe("copy");
    expect(press("C")).toBe("copy");
  });

  it("ignores other keys", () => {
    expect(press("x")).toBeNull();
    expect(press("Enter", "Enter")).toBeNull();
  });

  it("ignores a held key", () => {
    expect(press(" ", "Space", true)).toBeNull();
    expect(press("r", "KeyR", true)).toBeNull();
  });
});

describe("isTypingTarget", () => {
  it("is true for text fields", () => {
    expect(isTypingTarget({ tagName: "INPUT" })).toBe(true);
    expect(isTypingTarget({ tagName: "TEXTAREA" })).toBe(true);
    expect(isTypingTarget({ tagName: "DIV", isContentEditable: true })).toBe(
      true,
    );
  });

  it("is false for anything else", () => {
    expect(isTypingTarget({ tagName: "BUTTON" })).toBe(false);
    expect(isTypingTarget({})).toBe(false);
    expect(isTypingTarget(null)).toBe(false);
  });
});
