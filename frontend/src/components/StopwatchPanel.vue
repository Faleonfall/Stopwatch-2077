<template>
  <div
    class="stopwatch-panel min-h-screen flex flex-col justify-center items-center space-y-3"
  >
    <NeonCopiedMessage :trigger="copyTrigger" />
    <SelectableText :selectable="!isRunning">
      <!-- A reset mid-run remounts the digits so they snap to zero -->
      <div
        :key="displayKey"
        class="stopwatch-time flex font-cyber tabular-nums"
        @click="copyTime"
      >
        <StopwatchDigit
          :value="formattedMinutes"
          :transition-key="minutesKey"
          :fade="fades.minutes"
        />
        <span class="stopwatch-colon text-neon-yellow text-center inline-block"
          >:</span
        >
        <StopwatchDigit
          :value="formattedSeconds"
          :transition-key="secondsKey"
          :fade="fades.seconds"
        />
        <span class="stopwatch-colon text-neon-yellow text-center inline-block"
          >:</span
        >
        <StopwatchDigit
          :value="formattedCentiseconds"
          :transition-key="centisecondsKey"
          :fade="fades.centiseconds"
        />
      </div>
    </SelectableText>

    <!-- Controls -->
    <div class="stopwatch-controls">
      <button class="cyber-btn select-none" @click="toggle">
        {{ toggleLabel(isRunning) }}
      </button>
      <button class="cyber-btn select-none" @click="reset">Reset</button>
    </div>
    <NeonHelp />
  </div>
</template>

<script setup lang="ts">
import NeonCopiedMessage from "./NeonCopiedMessage.vue";
import NeonHelp from "./NeonHelp.vue";
import SelectableText from "./SelectableText.vue";
import StopwatchDigit from "./StopwatchDigit.vue";
import { useStopwatchControls } from "../composables/useStopwatchControls";
import { toggleLabel } from "../lib/stopwatchDisplay";

const {
  centisecondsKey,
  copyTime,
  copyTrigger,
  displayKey,
  fades,
  formattedCentiseconds,
  formattedMinutes,
  formattedSeconds,
  isRunning,
  minutesKey,
  reset,
  secondsKey,
  toggle,
} = useStopwatchControls();
</script>
