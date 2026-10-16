<template>
  <div
    class="stopwatch-panel min-h-screen flex flex-col justify-center items-center space-y-3"
  >
    <NeonCopiedMessage :trigger="copyTrigger" />
    <SelectableText :selectable="!isRunning">
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
            {{ formattedCentiseconds }}
          </span>
        </template>

        <!-- Otherwise: per‐digit fade for minutes & seconds, and (when paused) for centiseconds -->
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
              :key="formattedCentiseconds"
              class="text-neon-cyan w-[2ch] text-center inline-block"
            >
              {{ formattedCentiseconds }}
            </span>
          </template>
          <template v-else>
            <!-- paused/reset: fade -->
            <transition name="digit-fade" mode="out-in">
              <span
                :key="centisecondsKey"
                class="text-neon-cyan w-[2ch] text-center inline-block"
              >
                {{ formattedCentiseconds }}
              </span>
            </transition>
          </template>
        </template>
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
import { useStopwatchControls } from "../composables/useStopwatchControls";
import { toggleLabel } from "../lib/stopwatchDisplay";

const {
  centisecondsKey,
  copyTime,
  copyTrigger,
  formattedCentiseconds,
  formattedMinutes,
  formattedSeconds,
  isRunning,
  justReset,
  minutesKey,
  reset,
  secondsKey,
  toggle,
} = useStopwatchControls();
</script>
