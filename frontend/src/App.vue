<template>
  <main
    class="flex items-center justify-center bg-cyber-background overflow-hidden h-svh"
    @mousedown.self="blurActiveElement"
  >
    <StopwatchPanel />
  </main>
</template>

<script setup lang="ts">
import StopwatchPanel from "./components/StopwatchPanel.vue";
import { blurActiveElement } from "./lib/pageFocus";
</script>
