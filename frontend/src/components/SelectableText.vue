<template>
  <div :class="selectable ? 'select-text' : 'select-none'">
    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  selectable: boolean;
}>();
</script>
