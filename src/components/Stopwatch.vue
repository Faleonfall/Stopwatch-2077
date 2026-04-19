<template>
  <div class="min-h-screen flex flex-col justify-center items-center space-y-3">
    <NeonCopiedMessage :trigger="copyTrigger" color="#ffe600" />
    <Selectable
      ref="selectableRef"
      :selectable="!isRunning"
      :clearOnChange="true"
    >
      <div
        class="flex text-9xl font-cyber tabular-nums timer-select pb-3"
        @click="copyTime"
      >
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
          <span class="text-neon-yellow w-[0.6ch] text-center inline-block"
            >:</span
          >

          <!-- Seconds -->
          <transition name="digit-fade" mode="out-in">
            <span
              class="text-neon-cyan w-[2ch] text-center inline-block"
              :key="secondsKey"
            >
              {{ formattedSeconds }}
            </span>
          </transition>
          <span class="text-neon-yellow w-[0.6ch] text-center inline-block"
            >:</span
          >

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
      <button class="cyber-btn select-none" @click="toggle">
        {{ isRunning ? "Stop" : "Start" }}
      </button>
      <button class="cyber-btn select-none" @click="reset">Reset</button>
    </div>
    <NeonHelp />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import Selectable from "./Selectable.vue";
import NeonCopiedMessage from "./NeonCopiedMessage.vue";
import NeonHelp from "./NeonHelp.vue";
import { useKeyboardShortcuts } from "../composables/useKeyboardShortcuts";
import { useCopyToClipboard } from "../composables/useCopyToClipboard";
import { useStopwatch } from "../composables/useStopwatch";

export default defineComponent({
  name: "Stopwatch",
  components: { NeonHelp, Selectable, NeonCopiedMessage },
  setup() {
    const selectableRef = ref<InstanceType<typeof Selectable> | null>(null);
    const {
      formattedMinutes,
      formattedSeconds,
      formattedCentis,
      getCopyTime,
      isRunning,
      justReset,
      minutesKey,
      reset: resetStopwatch,
      secondsKey,
      toggle: toggleStopwatch,
    } = useStopwatch();
    const { copy, copyTrigger } = useCopyToClipboard();
    const copyCooldown = ref(false);

    function copyTime() {
      if (copyCooldown.value) return; // prevent spamming
      copy(getCopyTime());
      copyCooldown.value = true;
      setTimeout(() => (copyCooldown.value = false), 1000);
    }

    function toggle() {
      toggleStopwatch();
      selectableRef.value?.clearSelection();
    }

    function reset() {
      resetStopwatch();
      selectableRef.value?.clearSelection();
    }

    useKeyboardShortcuts(toggle, reset, copyTime);

    return {
      formattedMinutes,
      formattedSeconds,
      formattedCentis,
      isRunning,
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
  text-shadow:
    0 0 2px rgba(var(--color-neon-cyan-rgb), 0.8),
    0 0 6px rgba(var(--color-neon-cyan-rgb), 0.6),
    0 0 16px rgba(var(--color-neon-cyan-rgb), 0.3);
}

.timer-select .text-neon-yellow {
  text-shadow:
    0 0 2px rgba(var(--color-neon-yellow-rgb), 0.8),
    0 0 6px rgba(var(--color-neon-yellow-rgb), 0.6),
    0 0 16px rgba(var(--color-neon-yellow-rgb), 0.3);
}

@media (max-width: 768px) {
  .text-9xl {
    font-size: 5.3rem !important;
  }

  .timer-select .text-neon-yellow {
    width: 0.35ch !important;
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
    display: inline-block; /* Ensures width is respected */
    padding-left: 0;
    padding-right: 0;
  }

  .flex.space-x-12 {
    gap: 1.5rem !important;
  }
}
</style>
