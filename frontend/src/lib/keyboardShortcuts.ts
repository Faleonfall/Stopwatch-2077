export type ShortcutAction = "toggle" | "reset" | "copy";

interface ShortcutKey {
  key: string;
  code: string;
  repeat: boolean;
}

interface ShortcutTarget {
  tagName?: string;
  isContentEditable?: boolean;
}

export function shortcutFor({
  key,
  code,
  repeat,
}: ShortcutKey): ShortcutAction | null {
  // Holding a key repeats keydown, so only the first press counts.
  if (repeat) return null;
  if (code === "Space" || key === " ") return "toggle";
  if (key === "r" || key === "R") return "reset";
  if (key === "c" || key === "C") return "copy";
  return null;
}

export function isTypingTarget(target: ShortcutTarget | null) {
  if (!target) return false;
  return (
    target.tagName === "INPUT" ||
    target.tagName === "TEXTAREA" ||
    target.isContentEditable === true
  );
}
