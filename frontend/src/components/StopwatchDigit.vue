<template>
  <transition name="digit-fade" :css="fade" :mode="fade ? 'out-in' : 'default'">
    <span
      :key="transitionKey"
      class="text-neon-cyan w-[2ch] text-center inline-block"
    >
      {{ value }}
    </span>
  </transition>
</template>

<script setup lang="ts">
defineProps<{
  value: string;
  transitionKey: string;
  fade: boolean;
}>();
</script>
