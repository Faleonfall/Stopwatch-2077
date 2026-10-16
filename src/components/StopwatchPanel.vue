<template>
  <div
    class="stopwatch-panel min-h-screen flex flex-col justify-center items-center space-y-3"
  >
    <NeonCopiedMessage :trigger="copyTrigger" />
    <SelectableText
      ref="selectableRef"
      :selectable="!isRunning"
      :clear-on-change="true"
    >
      <div
        class="stopwatch-time flex font-cyber tabular-nums"
        @click="copyTime"
      >
        <!-- Reset mid-run: everything updates instantly -->
        <template v-if="isRunning && justReset">
          <span class="text-neon-cyan w-[2ch] text-center">
            {{ formattedMinutes }}
          </span>
          <span class="stopwatch-colon text-neon-yellow text-center">:</span>
          <span class="text-neon-cyan w-[2ch] text-center">
            {{ formattedSeconds }}
          </span>
          <span class="stopwatch-colon text-neon-yellow text-center">:</span>
          <span class="text-neon-cyan w-[2ch] text-center">
            {{ formattedCentis }}
          </span>
        </template>

        <!-- Otherwise: per‐digit fade for minutes & seconds, and (when paused) for centis -->
        <template v-else>
          <!-- Minutes -->
          <transition name="digit-fade" mode="out-in">
            <span
              :key="minutesKey"
              class="text-neon-cyan w-[2ch] text-center inline-block"
            >
              {{ formattedMinutes }}
            </span>
          </transition>
          <span
            class="stopwatch-colon text-neon-yellow text-center inline-block"
            >:</span
          >

          <!-- Seconds -->
          <transition name="digit-fade" mode="out-in">
            <span
              :key="secondsKey"
              class="text-neon-cyan w-[2ch] text-center inline-block"
            >
              {{ formattedSeconds }}
            </span>
          </transition>
          <span
            class="stopwatch-colon text-neon-yellow text-center inline-block"
            >:</span
          >

          <!-- Centiseconds -->
          <template v-if="isRunning">
            <!-- running (not reset): always instant -->
            <span
              :key="formattedCentis"
              class="text-neon-cyan w-[2ch] text-center inline-block"
            >
              {{ formattedCentis }}
            </span>
          </template>
          <template v-else>
            <!-- paused/reset: fade -->
            <transition name="digit-fade" mode="out-in">
              <span
                :key="formattedCentis + '-' + (justReset ? 'reset' : 'idle')"
                class="text-neon-cyan w-[2ch] text-center inline-block"
              >
                {{ formattedCentis }}
              </span>
            </transition>
          </template>
        </template>
      </div>
    </SelectableText>

    <!-- Controls -->
    <div class="stopwatch-controls">
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
import SelectableText from "./SelectableText.vue";
import NeonCopiedMessage from "./NeonCopiedMessage.vue";
import NeonHelp from "./NeonHelp.vue";
import { useKeyboardShortcuts } from "../composables/useKeyboardShortcuts";
import { useCopyToClipboard } from "../composables/useCopyToClipboard";
import { useStopwatch } from "../composables/useStopwatch";

export default defineComponent({
  name: "StopwatchPanel",
  components: { NeonHelp, SelectableText, NeonCopiedMessage },
  setup() {
    const selectableRef = ref<InstanceType<typeof SelectableText> | null>(null);
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
      void copy(getCopyTime());
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
