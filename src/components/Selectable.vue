<template>
  <div :class="[selectable ? 'select-text' : 'select-none']">
    <slot/>
  </div>
</template>

<script setup lang="ts">
import {watch} from 'vue';

const props = defineProps<{
  selectable: boolean,
  clearOnChange?: boolean
}>();

function clearSelection() {
  if (window.getSelection) {
    const sel = window.getSelection();
    if (sel && !sel.isCollapsed) sel.removeAllRanges();
  }
}

defineExpose({clearSelection});

watch(
    () => props.selectable,
    (now, old) => {
      if (props.clearOnChange && old !== undefined && now !== old && !now) {
        clearSelection();
      }
    }
);
</script>
