import { onBeforeUnmount, onMounted } from "vue";
import {
  isTypingTarget,
  shortcutFor,
  type ShortcutAction,
} from "../lib/keyboardShortcuts";

export function useKeyboardShortcuts(
  actions: Record<ShortcutAction, () => void>,
) {
  function handleKeyDown(event: KeyboardEvent) {
    if (isTypingTarget(event.target as HTMLElement | null)) return;

    const action = shortcutFor(event);
    if (!action) return;

    // Space would also scroll the page or press a focused button.
    if (action === "toggle") event.preventDefault();
    actions[action]();
  }

  onMounted(() => {
    window.addEventListener("keydown", handleKeyDown);
  });

  onBeforeUnmount(() => {
    window.removeEventListener("keydown", handleKeyDown);
  });
}
