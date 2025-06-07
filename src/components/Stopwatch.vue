<template>
  <div class="min-h-screen flex flex-col justify-center items-center space-y-3">
    <NeonCopiedMessage :trigger="copyTrigger" color="#ffe600"/>
    <Selectable ref="selectableRef" :selectable="!isRunning" :clearOnChange="true">
      <div class="flex text-9xl font-cyber tabular-nums timer-select pb-3" @click="copyTime">

        <!-- Reset mid-run: everything updates instantly -->
        <template v-if="isRunning && justReset">
          <span class="text-neon-cyan w-[2ch] text-center">
            {{ formattedMinutes }}
          </span>
          <span class="text-neon-yellow w-[0.6ch] text-center">:</span>
          <span class="text-neon-cyan w-[2ch] text-center">
            {{ formattedSeconds }}
          </span>
          <span class="text-neon-yellow w-[0.6ch] text-center">:</span>
          <span class="text-neon-cyan w-[2ch] text-center">
            {{ formattedCentis }}
          </span>
        </template>

        <!-- Otherwise: per‐digit fade for minutes & seconds, and (when paused) for centis -->
        <template v-else>
          <!-- Minutes -->
          <transition name="digit-fade" mode="out-in">
            <span
                class="text-neon-cyan w-[2ch] text-center inline-block"
                :key="minutesKey"
            >
              {{ formattedMinutes }}
            </span>
          </transition>
          <span class="text-neon-yellow w-[0.6ch] text-center inline-block">:</span>

          <!-- Seconds -->
          <transition name="digit-fade" mode="out-in">
            <span
                class="text-neon-cyan w-[2ch] text-center inline-block"
                :key="secondsKey"
            >
              {{ formattedSeconds }}
            </span>
          </transition>
          <span class="text-neon-yellow w-[0.6ch] text-center inline-block">:</span>

          <!-- Centiseconds -->
          <template v-if="isRunning">
            <!-- running (not reset): always instant -->
            <span
                class="text-neon-cyan w-[2ch] text-center inline-block"
                :key="formattedCentis"
            >
              {{ formattedCentis }}
            </span>
          </template>
          <template v-else>
            <!-- paused/reset: fade -->
            <transition name="digit-fade" mode="out-in">
              <span
                  class="text-neon-cyan w-[2ch] text-center inline-block"
                  :key="formattedCentis + '-' + (justReset ? 'reset' : 'idle')"
              >
                {{ formattedCentis }}
              </span>
            </transition>
          </template>
        </template>

      </div>
    </Selectable>

    <!-- Controls -->
    <div class="flex space-x-12">
      <button class="cyber-btn" @click="toggle">
        {{ isRunning ? "Stop" : "Start" }}
      </button>
      <button class="cyber-btn" @click="reset">
        Reset
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  computed,
  onBeforeUnmount,
  nextTick,
} from "vue";
import Selectable from "./Selectable.vue";
import NeonCopiedMessage from "./NeonCopiedMessage.vue";
import {useKeyboardShortcuts} from "../composables/useKeyboardShortcuts";
import {useCopyToClipboard} from "../composables/useCopyToClipboard";

export default defineComponent({
  name: "Stopwatch",
  components: {Selectable, NeonCopiedMessage},
  setup() {
    const selectableRef = ref<InstanceType<typeof Selectable> | null>(null);
    const elapsed = ref(0);
    const isRunning = ref(false);
    const justReset = ref(false);
    let intervalId: ReturnType<typeof setInterval> | null = null;
    let startTime = 0;

    const minutes = computed(() => Math.floor(elapsed.value / 60000));
    const seconds = computed(() => Math.floor((elapsed.value % 60000) / 1000));
    const centis = computed(() => Math.floor((elapsed.value % 1000) / 10));

    const formattedMinutes = computed(() => String(minutes.value).padStart(2, "0"));
    const formattedSeconds = computed(() => String(seconds.value).padStart(2, "0"));
    const formattedCentis = computed(() => String(centis.value).padStart(2, "0"));

    const isPaused = computed(() => !isRunning.value);
    const recentlyReset = computed(() => justReset.value && !isRunning.value);
    const {copy, copyTrigger} = useCopyToClipboard();

    const copyCooldown = ref(false);

    function copyTime() {
      if (copyCooldown.value) return; // prevent spamming
      const time = `${formattedMinutes.value}:${formattedSeconds.value}:${formattedCentis.value}`;
      copy(time);
      copyCooldown.value = true;
      setTimeout(() => (copyCooldown.value = false), 1000);
    }

    const minutesKey = computed(() => {
      // paused + Reset → force "-reset" to trigger fade
      if (justReset.value && !isRunning.value) {
        return `${formattedMinutes.value}-reset`
      }
      // normal tick → key is the number (fades whenever it changes)
      return formattedMinutes.value
    })

    const secondsKey = computed(() => {
      if (justReset.value && !isRunning.value) {
        return `${formattedSeconds.value}-reset`
      }
      return formattedSeconds.value
    })

    const startInterval = () => {
      clearInterval(intervalId!);
      startTime = Date.now() - elapsed.value;
      intervalId = setInterval(() => {
        elapsed.value = Date.now() - startTime;
      }, 10);
    };

    const toggle = () => {
      if (isRunning.value) {
        clearInterval(intervalId!);
        isRunning.value = false;
      } else {
        startInterval();
        isRunning.value = true;
      }
      selectableRef.value?.clearSelection();
    };

    const reset = () => {
      if (isRunning.value) {
        // mark that we’re in a running-reset
        justReset.value = true;

        clearInterval(intervalId!);
        elapsed.value = 0;
        startInterval();

        // clear the flag on next tick so normal ticking resumes
        nextTick(() => {
          justReset.value = false;
        });

        selectableRef.value?.clearSelection();
      } else {
        // unchanged: paused‐state reset with fade
        clearInterval(intervalId!);
        elapsed.value = 0;
        justReset.value = true;
        nextTick().then(() => {
          setTimeout(() => {
            justReset.value = false;
            selectableRef.value?.clearSelection();
          }, 120);
        });
      }
    };

    useKeyboardShortcuts(toggle, reset, copyTime);

    onBeforeUnmount(() => {
      clearInterval(intervalId!);
    });

    return {
      formattedMinutes,
      formattedSeconds,
      formattedCentis,
      isRunning,
      isPaused,
      recentlyReset,
      selectableRef,
      toggle,
      reset,
      justReset,
      minutesKey,
      secondsKey,
      copyTrigger,
      copyTime,
    };
  },
});
</script>

<style scoped>
.text-9xl {
  font-size: 8rem !important;
  cursor: pointer;
  text-shadow: 0 0 2px rgba(0, 240, 255, 0.8),
  0 0 6px rgba(0, 240, 255, 0.6),
  0 0 16px rgba(0, 240, 255, 0.3);
}

.timer-select .text-neon-yellow {
  text-shadow: 0 0 2px rgba(255, 255, 0, 0.85),
  0 0 6px rgba(255, 255, 0, 0.6),
  0 0 16px rgba(255, 255, 0, 0.3);
}

@media (max-width: 768px) {
  .text-9xl {
    font-size: 5.3rem !important;
  }

  .timer-select .text-neon-yellow {
    width: 0.35ch !important;
    /* You can go even smaller if you want, try 0.28ch, but .35ch is safe */
    display: inline-block; /* Ensures width is respected */
    padding-left: 0;
    padding-right: 0;
  }

  .timer-select.pb-3 {
    padding-bottom: 1.5rem;
  }

  .flex.space-x-12 {
    gap: 2rem !important;
  }

  .min-h-screen {
    padding-left: 0.5rem;
    padding-right: 0.5rem;
  }
}

@media (max-width: 480px) {
  .text-9xl {
    font-size: 4.2rem !important;
  }

  .timer-select .text-neon-yellow {
    width: 0.3ch !important;
    /* You can go even smaller if you want, try 0.28ch, but .35ch is safe */
    display: inline-block; /* Ensures width is respected */
    padding-left: 0;
    padding-right: 0;
  }

  .flex.space-x-12 {
    gap: 1.5rem !important;
  }
}
</style>
