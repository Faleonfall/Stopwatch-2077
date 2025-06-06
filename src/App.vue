<template>
  <div class="min-h-screen flex items-center justify-center bg-cyber-background">
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
