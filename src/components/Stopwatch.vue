<template>
  <div class="flex flex-col items-center space-y-9 p-12 select-none">
    <!-- Fixed-width container, tabular numerals -->
    <div class="flex text-9xl font-cyber tabular-nums">
      <!-- Minutes -->
      <template v-if="isRunning">
        <span
            class="text-neon-cyan w-[2ch] text-center inline-block"
            :key="formattedMinutes"
        >
          {{ formattedMinutes }}
        </span>
      </template>
      <template v-else>
        <transition name="digit-fade" mode="out-in">
          <span
              class="text-neon-cyan w-[2ch] text-center inline-block"
              :key="resetCount + '-' + formattedMinutes"
          >
            {{ formattedMinutes }}
          </span>
        </transition>
      </template>

      <span class="text-neon-yellow w-[0.6ch] text-center inline-block">:</span>

      <!-- Seconds -->
      <template v-if="isRunning">
        <span
            class="text-neon-cyan w-[2ch] text-center inline-block"
            :key="formattedSeconds"
        >
          {{ formattedSeconds }}
        </span>
      </template>
      <template v-else>
        <transition name="digit-fade" mode="out-in">
          <span
              class="text-neon-cyan w-[2ch] text-center inline-block"
              :key="resetCount + '-' + formattedSeconds"
          >
            {{ formattedSeconds }}
          </span>
        </transition>
      </template>

      <span class="text-neon-yellow w-[0.6ch] text-center inline-block">:</span>

      <!-- Centiseconds -->
      <template v-if="isPaused || recentlyReset">
        <transition name="digit-fade" mode="out-in">
          <span
              class="text-neon-cyan w-[2ch] text-center inline-block"
              :key="resetCount + '-' + formattedMilliseconds"
          >
            {{ formattedMilliseconds }}
          </span>
        </transition>
      </template>
      <template v-else>
        <span class="text-neon-cyan w-[2ch] text-center inline-block">
          {{ formattedMilliseconds }}
        </span>
      </template>
    </div>

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
  onBeforeUnmount, nextTick,
} from "vue";

export default defineComponent({
  name: "Stopwatch",
  setup() {
    const elapsed = ref(0);
    const isRunning = ref(false);
    const isPaused = ref(true);
    const resetCount = ref(0);
    const lastAppliedReset = ref(0);
    const startTime = ref(Date.now());
    let intervalId: ReturnType<typeof setInterval> | null = null;

    const minutes = computed(() => Math.floor(elapsed.value / 60000));
    const seconds = computed(() =>
        Math.floor((elapsed.value % 60000) / 1000)
    );
    const milliseconds = computed(() => elapsed.value % 1000);

    const formattedMinutes = computed(() =>
        String(minutes.value).padStart(2, "0")
    );
    const formattedSeconds = computed(() =>
        String(seconds.value).padStart(2, "0")
    );
    const formattedMilliseconds = computed(() =>
        String(Math.floor(milliseconds.value / 10)).padStart(2, "0")
    );

    const recentlyReset = computed(() =>
        !isRunning.value && resetCount.value > lastAppliedReset.value
    );

    const toggle = () => {
      if (isRunning.value) {
        clearInterval(intervalId!);
        isRunning.value = false;
        isPaused.value = true;
      } else {
        lastAppliedReset.value = resetCount.value;
        isPaused.value = false;
        isRunning.value = true;
        startTime.value = Date.now() - elapsed.value;
        intervalId = setInterval(() => {
          elapsed.value = Date.now() - startTime.value;
        }, 10);
      }
    };

    const reset = async () => {
      if (isRunning.value) {
        elapsed.value = 0;
        startTime.value = Date.now();
      } else {
        clearInterval(intervalId!);
        elapsed.value = 0;
        isRunning.value = false;
        resetCount.value++;
        await nextTick();
        await new Promise(res => setTimeout(res, 120));
        lastAppliedReset.value = resetCount.value;
      }
    };

    onBeforeUnmount(() => {
      clearInterval(intervalId!);
    });

    return {
      formattedMinutes,
      formattedSeconds,
      formattedMilliseconds,
      isRunning,
      isPaused,
      resetCount,
      recentlyReset,
      toggle,
      reset,
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
