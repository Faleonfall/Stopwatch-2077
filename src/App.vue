<template>
  <main
    class="flex items-center justify-center bg-cyber-background overflow-hidden h-svh"
    @mousedown.self="clearFocus"
  >
    <Stopwatch />
  </main>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Stopwatch from "./components/Stopwatch.vue";

export default defineComponent({
  name: "App",
  components: { Stopwatch },
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

<style scoped></style>
