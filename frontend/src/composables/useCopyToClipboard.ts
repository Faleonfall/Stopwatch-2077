import { ref } from "vue";
import { COPY_COOLDOWN_MS } from "../lib/stopwatchTimings";

export function useCopyToClipboard() {
  const copyTrigger = ref(0);
  let coolingDown = false;

  async function copy(text: string) {
    // Ignore repeats during the cooldown, so mashing C copies once.
    if (coolingDown) return;
    coolingDown = true;
    setTimeout(() => {
      coolingDown = false;
    }, COPY_COOLDOWN_MS);

    try {
      await navigator.clipboard.writeText(text);
      // Counts up on every copy, so the flash replays even on rapid copies.
      copyTrigger.value++;
    } catch {
      // A denied clipboard leaves the time uncopied, nothing else to undo.
    }
  }

  return {
    copy,
    copyTrigger,
  };
}
