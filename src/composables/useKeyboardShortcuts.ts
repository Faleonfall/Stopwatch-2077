import {onMounted, onBeforeUnmount} from "vue";

export function useKeyboardShortcuts(
    toggle: () => void,
    reset: () => void,
    copyTime?: () => void
) {
    function handleKeyDown(e: KeyboardEvent) {
        if (e.repeat) return; // prevent spamming when holding a key

        const target = e.target as HTMLElement;
        const tag = target.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA" || target.isContentEditable) return;

        if (e.code === "Space" || e.key === " ") {
            e.preventDefault();
            toggle();
            return;
        }

        if (e.key === "r" || e.key === "R") {
            reset();
            return;
        }

        if ((e.key === "c" || e.key === "C") && typeof copyTime === "function") {
            copyTime();
        }
    }

    onMounted(() => {
        window.addEventListener("keydown", handleKeyDown);
    });

    onBeforeUnmount(() => {
        window.removeEventListener("keydown", handleKeyDown);
    });
}
