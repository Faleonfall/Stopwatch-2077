<template>
  <main
    class="flex items-center justify-center bg-cyber-background overflow-hidden h-svh"
    @mousedown.self="clearFocus"
  >
    <StopwatchPanel />
  </main>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import StopwatchPanel from "./components/StopwatchPanel.vue";

export default defineComponent({
  name: "App",
  components: { StopwatchPanel },
  setup() {
    function clearFocus() {
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
    }

    return { clearFocus };
  },
});
</script>
