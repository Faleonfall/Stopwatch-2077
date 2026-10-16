<template>
  <div>
    <!-- Mouse/trackpad device: Show floating ? help -->
    <div v-if="isDesktop" class="help-container">
      <button
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
import { useHelpPopup } from "../composables/useHelpPopup";

const { hidePopup, isDesktop, isRendered, popup, queueHidePopup, showPopup } =
  useHelpPopup();
</script>
