import { nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { playPopupIn, playPopupOut } from "../lib/neonAnimations";
import { HELP_HIDE_DELAY_MS } from "../lib/stopwatchTimings";

export function useHelpPopup() {
  // Fine means a mouse or trackpad, coarse means touch.
  const pointerQuery = window.matchMedia("(pointer: fine)");
  const isDesktop = ref(pointerQuery.matches);
  const show = ref(false);
  const isRendered = ref(false);
  const popup = ref<HTMLElement | null>(null);
  let hideTimeout: ReturnType<typeof setTimeout> | null = null;

  function onPointerChange(event: MediaQueryListEvent) {
    isDesktop.value = event.matches;
  }

  function showPopup() {
    if (hideTimeout) {
      clearTimeout(hideTimeout);
      hideTimeout = null;
    }
    isRendered.value = true;
    show.value = true;
  }

  function queueHidePopup() {
    hideTimeout = setTimeout(() => {
      show.value = false;
    }, HELP_HIDE_DELAY_MS);
  }

  function hidePopup() {
    show.value = false;
  }

  watch(show, async (visible) => {
    await nextTick();
    if (!popup.value) return;

    if (visible) {
      playPopupIn(popup.value);
    } else {
      playPopupOut(popup.value, () => {
        isRendered.value = false;
      });
    }
  });

  onMounted(() => {
    pointerQuery.addEventListener("change", onPointerChange);
  });

  onBeforeUnmount(() => {
    pointerQuery.removeEventListener("change", onPointerChange);
  });

  return {
    hidePopup,
    isDesktop,
    isRendered,
    popup,
    queueHidePopup,
    showPopup,
  };
}
