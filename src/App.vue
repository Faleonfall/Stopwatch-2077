<template>
  <div class="flex items-center justify-center bg-cyber-background overflow-hidden h-[100svh]">
    <Stopwatch/>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import Stopwatch from "./components/Stopwatch.vue";

export default defineComponent({
  name: "App",
  components: {Stopwatch},
});
</script>

<style scoped>
</style>
