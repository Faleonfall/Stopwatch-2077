import { ref } from "vue";

export function useCopyToClipboard() {
  const copyTrigger = ref(0);

  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      copyTrigger.value++; // always triggers animation, even if called rapidly
    } catch {
      // A denied clipboard leaves the time uncopied, nothing else to undo.
    }
  }

  return {
    copy,
    copyTrigger,
  };
}
