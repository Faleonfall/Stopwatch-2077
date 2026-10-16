<template>
  <div
    ref="neon"
    class="neon-message fixed top-6 left-1/2 -translate-x-1/2 z-50 select-none pointer-events-none"
  >
    <span class="neon-text"> Copied </span>
  </div>
</template>

<script setup lang="ts">
import { useCopiedFlash } from "../composables/useCopiedFlash";

const props = defineProps<{
  trigger: number;
}>();

const { neon } = useCopiedFlash(() => props.trigger);
</script>
