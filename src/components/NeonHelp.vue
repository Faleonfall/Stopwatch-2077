<template>
  <div>
    <!-- Desktop (>=1024px): Show floating ? help -->
    <div v-if="isDesktop" class="help-container">
      <button
          class="neon-help-btn select-none"
          ref="helpBtn"
          @mouseenter="showPopup"
          @mouseleave="queueHidePopup"
          @focus="showPopup"
          @blur="queueHidePopup"
          @keydown.esc="hidePopup"
          aria-label="Show keyboard shortcuts and info"
      >?
      </button>
      <div
          v-if="isRendered"
          class="neon-help-popup select-none"
          ref="popup"
          tabindex="-1"
          @mouseenter="showPopup"
          @mouseleave="queueHidePopup"
          @keydown.esc="hidePopup"
      >
        <div class="help-title">Shortcuts</div>
        <ul class="help-list">
          <li><span class="help-key">Start/Stop:</span> <span class="help-shortcut">Space</span></li>
          <li><span class="help-key">Reset:</span> <span class="help-shortcut">R</span></li>
          <li><span class="help-key">Copy:</span> <span class="help-shortcut">C</span></li>
        </ul>
        <a
            href="https://github.com/Faleonfall/Stopwatch-2077"
            class="help-link"
            target="_blank"
            rel="noopener"
        >GitHub</a>
      </div>
    </div>
    <!-- Mobile/tablet (<1024px): Show GitHub link centered -->
    <div v-else class="mobile-help-link">
      <a
          href="https://github.com/Faleonfall/Stopwatch-2077"
          class="help-link"
          target="_blank"
          rel="noopener"
      >GitHub</a>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, watch, nextTick, onMounted, onUnmounted} from "vue";
import {gsap} from "gsap";

// --- Responsive detection ---
const isDesktop = ref(window.innerWidth >= 1024);

function checkScreen() {
  isDesktop.value = window.innerWidth >= 1024;
}

onMounted(() => {
  window.addEventListener("resize", checkScreen);
  checkScreen();
});
onUnmounted(() => {
  window.removeEventListener("resize", checkScreen);
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
    gsap.timeline()
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
    gsap.timeline({
      onComplete: () => {
        isRendered.value = false;
      }
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

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap');

.help-container {
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  z-index: 999;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.neon-help-btn {
  width: 2.65rem;
  height: 2.65rem;
  border-radius: 50%;
  border: 2px solid var(--color-neon-pink);
  background: var(--color-cyber-background, #181827);
  color: var(--color-neon-yellow);
  font-family: var(--font-cyber), "Orbitron", sans-serif;
  font-size: 1.5rem;
  font-weight: 700;
  box-shadow: 0 0 8px var(--color-neon-pink, #FF007F), 0 0 0 #000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  cursor: pointer;
  transition: box-shadow 0.18s, background 0.18s;
  outline: none;
}

.neon-help-btn:hover,
.neon-help-btn:focus-visible {
  box-shadow: 0 0 8px var(--color-neon-pink, #FF007F), 0 0 16px var(--color-neon-pink, #FF007F);
  background: #22223a;
}

.neon-help-popup {
  position: absolute;
  bottom: 3.3rem;
  right: 0;
  font-family: var(--font-cyber), 'Orbitron', sans-serif !important;
  font-size: 1.03rem;
  font-weight: 400;
  letter-spacing: 0.015em;
  line-height: 1.48;
  color: var(--color-neon-yellow);
  background: rgba(18, 18, 27, 0.97);
  border: 2px solid var(--color-neon-pink);
  border-radius: 1.2rem;
  min-width: 220px;
  padding: 1.1rem 1.35rem 1.1rem 1.35rem;
  box-shadow: 0 0 14px var(--color-neon-pink, #FF007F), 0 0 10px #00f0ff22;
  z-index: 100;
}

.neon-help-popup .help-title {
  font-size: 1.11rem;
  font-weight: 700;
  margin-bottom: 0.6rem;
  text-shadow: 0 0 7px var(--color-neon-yellow, #FFEA00cc);
  color: var(--color-neon-yellow);
  letter-spacing: 0.025em;
  font-family: inherit;
}

.neon-help-popup .help-list {
  list-style: none;
  margin: 0 0 0.65rem 0;
  padding: 0;
  font-size: 1.03rem;
  font-family: inherit;
}

.neon-help-popup .help-key,
.neon-help-popup .help-shortcut {
  color: var(--color-neon-yellow);
  font-family: inherit;
  font-size: 1em;
  font-weight: 400;
  letter-spacing: 0.013em;
}

.neon-help-popup .help-key {
  color: var(--color-neon-cyan);
}

.neon-help-popup .help-link,
.mobile-help-link .help-link {
  display: inline-block;
  color: var(--color-neon-yellow);
  font-family: var(--font-cyber), 'Orbitron', sans-serif;
  font-size: 1.07em;
  text-shadow: 0 0 5px var(--color-neon-yellow, #FFEA0099);
  text-decoration: underline;
  transition: color 0.12s;
  letter-spacing: 0.02em;
  font-weight: 400;
  margin: 0 auto;
}

.neon-help-popup .help-link:hover,
.mobile-help-link .help-link:hover {
  color: var(--color-neon-pink);
  text-shadow: 0 0 5px var(--color-neon-pink, #FF007F);
}

.mobile-help-link {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 1.6rem;
  z-index: 999;
  display: flex;
  justify-content: center;
}
</style>
