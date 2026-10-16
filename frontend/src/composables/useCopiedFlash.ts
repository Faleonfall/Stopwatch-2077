import { nextTick, ref, watch } from "vue";
import { playCopiedFlash } from "../lib/neonAnimations";

// Plays the flash each time the trigger counts up.
export function useCopiedFlash(trigger: () => number) {
  const neon = ref<HTMLElement | null>(null);

  watch(trigger, async () => {
    await nextTick();
    if (neon.value) playCopiedFlash(neon.value);
  });

  return { neon };
}
