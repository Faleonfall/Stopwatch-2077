import { computed, nextTick, onBeforeUnmount, ref } from "vue";
import {
  centisecondsKey as centisecondsKeyFor,
  digitKey,
  formatStopwatchCopyTime,
  formatStopwatchDisplayTime,
} from "../lib/stopwatchDisplay";
import { RESET_FADE_MS, TICK_MS } from "../lib/stopwatchTimings";

export function useStopwatch() {
  const elapsed = ref(0);
  const isRunning = ref(false);
  const justReset = ref(false);

  let intervalId: ReturnType<typeof setInterval> | null = null;
  let startTime = 0;

  const displayTime = computed(() => formatStopwatchDisplayTime(elapsed.value));
  const formattedMinutes = computed(() => displayTime.value.minutes);
  const formattedSeconds = computed(() => displayTime.value.seconds);
  const formattedCentiseconds = computed(() => displayTime.value.centiseconds);

  const minutesKey = computed(() =>
    digitKey(formattedMinutes.value, justReset.value, isRunning.value),
  );
  const secondsKey = computed(() =>
    digitKey(formattedSeconds.value, justReset.value, isRunning.value),
  );
  const centisecondsKey = computed(() =>
    centisecondsKeyFor(formattedCentiseconds.value, justReset.value),
  );

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
    }, TICK_MS);
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

      void nextTick(() => {
        justReset.value = false;
      });

      return;
    }

    clearIntervalIfNeeded();
    elapsed.value = 0;
    justReset.value = true;

    void nextTick().then(() => {
      setTimeout(() => {
        justReset.value = false;
      }, RESET_FADE_MS);
    });
  }

  onBeforeUnmount(() => {
    clearIntervalIfNeeded();
  });

  return {
    centisecondsKey,
    formattedMinutes,
    formattedSeconds,
    formattedCentiseconds,
    getCopyTime,
    isRunning,
    justReset,
    minutesKey,
    reset,
    secondsKey,
    toggle,
  };
}
