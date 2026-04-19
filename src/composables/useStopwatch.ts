import { computed, nextTick, onBeforeUnmount, ref } from "vue";
import {
  formatStopwatchCopyTime,
  formatStopwatchDisplayTime,
} from "../utils/formatStopwatchTime";

export function useStopwatch() {
  const elapsed = ref(0);
  const isRunning = ref(false);
  const justReset = ref(false);

  let intervalId: ReturnType<typeof setInterval> | null = null;
  let startTime = 0;

  const displayTime = computed(() => formatStopwatchDisplayTime(elapsed.value));
  const formattedMinutes = computed(() => displayTime.value.minutes);
  const formattedSeconds = computed(() => displayTime.value.seconds);
  const formattedCentis = computed(() => displayTime.value.centiseconds);

  const minutesKey = computed(() => {
    if (justReset.value && !isRunning.value) {
      return `${formattedMinutes.value}-reset`;
    }

    return formattedMinutes.value;
  });

  const secondsKey = computed(() => {
    if (justReset.value && !isRunning.value) {
      return `${formattedSeconds.value}-reset`;
    }

    return formattedSeconds.value;
  });

  function clearIntervalIfNeeded() {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  }

  function startInterval() {
    clearIntervalIfNeeded();
    startTime = Date.now() - elapsed.value;
    intervalId = setInterval(() => {
      elapsed.value = Date.now() - startTime;
    }, 10);
  }

  function getCurrentElapsed() {
    return isRunning.value ? Date.now() - startTime : elapsed.value;
  }

  function getCopyTime() {
    return formatStopwatchCopyTime(getCurrentElapsed());
  }

  function toggle() {
    if (isRunning.value) {
      clearIntervalIfNeeded();
      isRunning.value = false;
      return;
    }

    startInterval();
    isRunning.value = true;
  }

  function reset() {
    if (isRunning.value) {
      justReset.value = true;
      clearIntervalIfNeeded();
      elapsed.value = 0;
      startInterval();

      nextTick(() => {
        justReset.value = false;
      });

      return;
    }

    clearIntervalIfNeeded();
    elapsed.value = 0;
    justReset.value = true;

    nextTick().then(() => {
      setTimeout(() => {
        justReset.value = false;
      }, 120);
    });
  }

  onBeforeUnmount(() => {
    clearIntervalIfNeeded();
  });

  return {
    formattedMinutes,
    formattedSeconds,
    formattedCentis,
    getCopyTime,
    isRunning,
    justReset,
    minutesKey,
    reset,
    secondsKey,
    toggle,
  };
}
