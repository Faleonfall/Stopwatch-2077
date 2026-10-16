<template>
  <div>
    <!-- Mouse/trackpad device: Show floating ? help -->
    <div v-if="isDesktop" class="help-container">
      <button
        ref="helpBtn"
        class="neon-help-btn select-none"
        aria-label="Show keyboard shortcuts and info"
        @mouseenter="showPopup"
        @mouseleave="queueHidePopup"
        @focus="showPopup"
        @blur="queueHidePopup"
        @keydown.esc="hidePopup"
      >
        ?
      </button>
      <div
        v-if="isRendered"
        ref="popup"
        class="neon-help-popup select-none"
        tabindex="-1"
        @mouseenter="showPopup"
        @mouseleave="queueHidePopup"
        @keydown.esc="hidePopup"
      >
        <div class="help-title">Shortcuts</div>
        <ul class="help-list">
          <li>
            <span class="help-key">Start/Stop:</span>
            <span class="help-shortcut"> Space</span>
          </li>
          <li>
            <span class="help-key">Reset:</span>
            <span class="help-shortcut"> R</span>
          </li>
          <li>
            <span class="help-key">Copy:</span>
            <span class="help-shortcut"> C</span>
          </li>
        </ul>
        <a
          href="https://github.com/Faleonfall/Stopwatch-2077"
          class="help-link"
          tabindex="-1"
          target="_blank"
          rel="noopener"
          >GitHub</a
        >
      </div>
    </div>
    <!-- Touch device: Show GitHub link centered -->
    <div v-else class="mobile-help-link">
      <a
        href="https://github.com/Faleonfall/Stopwatch-2077"
        class="help-link"
        target="_blank"
        rel="noopener"
        >GitHub</a
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, onMounted, onUnmounted } from "vue";
import { gsap } from "gsap";

// --- Pointer detection (fine = mouse/trackpad, coarse = touch) ---
const pointerQuery = window.matchMedia("(pointer: fine)");
const isDesktop = ref(pointerQuery.matches);

function onPointerChange(e: MediaQueryListEvent) {
  isDesktop.value = e.matches;
}

onMounted(() => {
  pointerQuery.addEventListener("change", onPointerChange);
});
onUnmounted(() => {
  pointerQuery.removeEventListener("change", onPointerChange);
});

// --- Popup logic ---
const show = ref(false);
const isRendered = ref(false);
const popup = ref<HTMLElement | null>(null);
let hideTimeout: number | null = null;

function showPopup() {
  if (hideTimeout) {
    clearTimeout(hideTimeout);
    hideTimeout = null;
  }
  if (!isRendered.value) isRendered.value = true;
  show.value = true;
}

function queueHidePopup() {
  hideTimeout = window.setTimeout(() => {
    show.value = false;
  }, 70);
}

function hidePopup() {
  show.value = false;
}

// Animate in/out
watch(show, async (val) => {
  await nextTick();
  if (!popup.value) return;
  gsap.killTweensOf(popup.value);

  if (val) {
    gsap.set(popup.value, {
      opacity: 0,
      scale: 0.96,
      filter: "blur(3.2px) brightness(2.8)",
    });
    gsap
      .timeline()
      .to(popup.value, {
        opacity: 1,
        filter: "blur(1.4px) brightness(3.1)",
        scale: 1.03,
        duration: 0.11,
        ease: "power2.out",
      })
      .to(popup.value, {
        filter: "blur(0.2px) brightness(1.12)",
        scale: 1,
        duration: 0.17,
        ease: "expo.out",
      });
  } else {
    gsap
      .timeline({
        onComplete: () => {
          isRendered.value = false;
        },
      })
      .to(popup.value, {
        opacity: 0.24,
        filter: "blur(0.7px) brightness(0.55)",
        duration: 0.045,
        ease: "power1.in",
      })
      .to(popup.value, {
        opacity: 1,
        filter: "blur(0.3px) brightness(2.5)",
        duration: 0.055,
        ease: "power2.out",
      })
      .to(popup.value, {
        opacity: 0.21,
        filter: "blur(2px) brightness(0.25)",
        duration: 0.036,
        ease: "power1.in",
      })
      .to(popup.value, {
        opacity: 1,
        filter: "blur(0.5px) brightness(1.3)",
        duration: 0.055,
        ease: "power2.out",
      })
      .to(popup.value, {
        opacity: 0,
        filter: "blur(7px) brightness(0.12)",
        scale: 0.98,
        duration: 0.17,
        ease: "power1.in",
      });
  }
});
watch(show, (val) => {
  if (val) isRendered.value = true;
});
</script>
