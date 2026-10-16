import "@testing-library/jest-dom/vitest";

import { cleanup } from "@testing-library/vue";
import { afterEach } from "vitest";

// jsdom does not implement matchMedia, which components rely on for
// pointer/media detection. Provide a minimal, no-op stub for tests.
if (typeof window !== "undefined" && typeof window.matchMedia !== "function") {
  window.matchMedia = (query: string): MediaQueryList => {
    const stub: Omit<MediaQueryList, "addListener" | "removeListener"> = {
      // Default the test environment to a desktop / fine-pointer device.
      matches: query.includes("pointer: fine"),
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    };
    return stub as MediaQueryList;
  };
}

afterEach(() => {
  cleanup();
  localStorage.clear();
});
