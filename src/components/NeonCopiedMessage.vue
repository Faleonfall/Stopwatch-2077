<template>
  <div
      ref="neon"
      class="neon-message fixed top-6 left-1/2 -translate-x-1/2 z-50 select-none pointer-events-none"
      style="pointer-events: none;"
  >
    <span class="neon-text">
      Copied
    </span>
  </div>
</template>

<script lang="ts">
import {defineComponent, ref, watch, nextTick} from "vue";
import {gsap} from "gsap";

export default defineComponent({
  name: "NeonCopiedMessage",
  props: {
    trigger: {type: Number, required: true},
  },
  setup(props) {
    const visible = ref(false);
    const neon = ref<HTMLDivElement | null>(null);
    const neonColor = "#ffe600";

    const animate = () => {
      console.log("Animating!", props.trigger, neon.value);
      if (!neon.value) return;
      gsap.killTweensOf(neon.value); // Kill running animations
      visible.value = true;
      gsap.set(neon.value, {
        opacity: 0,
        filter: "brightness(0.3)",
        y: 0,
        textShadow: `0 0 0 ${neonColor}`,
      });
      gsap.timeline()
          .to(neon.value, {
            opacity: 1,
            filter: "brightness(2.1)",
            textShadow: `0 0 24px ${neonColor}, 0 0 40px ${neonColor}`,
            duration: 0.23,
            ease: "power2.out",
          })
          .to(neon.value, {
            filter: "brightness(1.2)",
            textShadow: `0 0 16px ${neonColor}, 0 0 28px ${neonColor}`,
            duration: 0.33,
            ease: "power1.inOut",
          })
          .to(neon.value, {
            filter: "brightness(0.5)",
            textShadow: `0 0 7px ${neonColor}, 0 0 10px ${neonColor}`,
            duration: 0.055,
            ease: "power1.in",
          })
          .to(neon.value, {
            filter: "brightness(2.2)",
            textShadow: `0 0 32px ${neonColor}, 0 0 54px ${neonColor}`,
            duration: 0.065,
            ease: "power1.out",
          })
          .to(neon.value, {
            filter: "brightness(0.7)",
            textShadow: `0 0 9px ${neonColor}, 0 0 14px ${neonColor}`,
            duration: 0.045,
            ease: "power1.in",
          })
          .to(neon.value, {
            filter: "brightness(1.2)",
            textShadow: `0 0 18px ${neonColor}, 0 0 30px ${neonColor}`,
            duration: 0.13,
            ease: "power2.out",
          })
          .to(neon.value, {
            opacity: 0,
            filter: "brightness(0.1)",
            textShadow: "0 0 0 #000",
            duration: 0.33,
            ease: "power2.in",
            onComplete: () => {
              visible.value = false;
            }
          });
    };

    watch(
        () => props.trigger,
        async () => {
          await nextTick();
          animate();
        }
    );

    return {visible, neon};
  },
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Monoton&display=swap');

.neon-text {
  font-family: 'Monoton', cursive;
  font-size: 2.7rem;
  letter-spacing: 0.05em;
  color: #ffe600;
  text-shadow: 0 0 12px #ffe600,
  0 0 20px #ffe600;
}

.neon-message {
  opacity: 0;
}

</style>
