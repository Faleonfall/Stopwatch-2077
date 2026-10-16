import { clearTextSelection } from "../lib/pageFocus";
import { useCopyToClipboard } from "./useCopyToClipboard";
import { useKeyboardShortcuts } from "./useKeyboardShortcuts";
import { useStopwatch } from "./useStopwatch";

// Wires the stopwatch to its buttons, keys and the clipboard.
export function useStopwatchControls() {
  const stopwatch = useStopwatch();
  const { copy, copyTrigger } = useCopyToClipboard();

  // A selection left on the digits would follow them as they change.
  function toggle() {
    stopwatch.toggle();
    clearTextSelection();
  }

  function reset() {
    stopwatch.reset();
    clearTextSelection();
  }

  function copyTime() {
    void copy(stopwatch.getCopyTime());
  }

  useKeyboardShortcuts({ toggle, reset, copy: copyTime });

  return {
    ...stopwatch,
    copyTime,
    copyTrigger,
    reset,
    toggle,
  };
}
