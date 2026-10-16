<template>
  <transition name="digit-fade" :css="fade" :mode="digitTransitionMode(fade)">
    <span
      :key="transitionKey"
      class="text-neon-cyan w-[2ch] text-center inline-block"
    >
      {{ value }}
    </span>
  </transition>
</template>

<script setup lang="ts">
import { digitTransitionMode } from "../lib/stopwatchDisplay";

defineProps<{
  value: string;
  transitionKey: string;
  fade: boolean;
}>();
</script>
