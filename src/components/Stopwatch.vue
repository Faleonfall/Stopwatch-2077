<template>
  <div class="min-h-screen flex flex-col justify-center items-center space-y-3">
    <Selectable ref="selectableRef" :selectable="!isRunning" :clearOnChange="true">
      <div class="flex text-9xl font-cyber tabular-nums timer-select pb-3">

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

export default defineComponent({
  name: "Stopwatch",
  components: {Selectable},
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
    };
  },
});
</script>

<style scoped>
.text-9xl {
  font-size: 8rem !important;
  text-shadow: 0 0 2px rgba(0, 240, 255, 0.8),
  0 0 6px rgba(0, 240, 255, 0.6),
  0 0 16px rgba(0, 240, 255, 0.3);
}

.digit-fade-enter-active,
.digit-fade-leave-active {
  transition: opacity 0.15s ease-in-out;
}

.digit-fade-enter-from,
.digit-fade-leave-to {
  opacity: 0;
}

.timer-select ::selection {
  background: transparent;
  color: #00ff2a;
  text-shadow: 0 0 4px rgba(0, 255, 42, 0.8),
  0 0 8px rgba(0, 255, 42, 0.6),
  0 0 22px rgba(0, 255, 42, 0.3);
}

.timer-select ::-moz-selection {
  background: transparent;
  color: #00ff2a;
  text-shadow: 0 0 4px rgba(0, 255, 42, 0.8),
  0 0 8px rgba(0, 255, 42, 0.6),
  0 0 22px rgba(0, 255, 42, 0.3);
}

.cyber-btn {
  position: relative;
  color: var(--color-neon-yellow);
  background: var(--color-cyber-background);
  font-family: var(--font-cyber), sans-serif;
  min-width: 13.5rem;
  text-align: center;
  transition: background 0.2s, color 0.2s, box-shadow 0.2s;
  overflow: hidden;
  padding: 0.75rem 3rem;

  border: none;
  border-radius: 1.125rem;
  text-transform: uppercase;
  font-weight: bold;
  letter-spacing: 0.15em;
  font-size: 1.5rem;
  cursor: pointer;
  box-shadow: 0 0 0 3px var(--color-neon-pink),
  0 0 12px 2px var(--color-neon-pink);
}

.cyber-btn::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  pointer-events: none;
  z-index: 0;
  opacity: 0.6;
  box-shadow: 0 0 21px 9px var(--color-neon-pink);
  filter: blur(3px);
  transition: opacity 0.2s;
}

.cyber-btn:hover {
  background: var(--color-neon-pink);
  color: var(--color-cyber-background);
  box-shadow: 0 0 0 3px var(--color-neon-pink),
  0 0 24px 5px var(--color-neon-pink);
}

.cyber-btn:hover::before {
  opacity: 0.85;
}
</style>
