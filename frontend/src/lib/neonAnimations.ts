import { gsap } from "gsap";

// GSAP tweens the glow between literal colors, so the token is read when the
// flash plays instead of written here a second time.
function tokenColor(name: string) {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
}

// Flickers the "Copied" message on like a neon tube, then fades it out.
export function playCopiedFlash(element: HTMLElement) {
  const color = tokenColor("--color-neon-yellow");
  const glow = (inner: number, outer: number) =>
    `0 0 ${inner}px ${color}, 0 0 ${outer}px ${color}`;

  gsap.killTweensOf(element);
  gsap.set(element, {
    opacity: 0,
    filter: "brightness(0.3)",
    y: 0,
    textShadow: `0 0 0 ${color}`,
  });
  gsap
    .timeline()
    .to(element, {
      opacity: 1,
      filter: "brightness(2.1)",
      textShadow: glow(24, 40),
      duration: 0.23,
      ease: "power2.out",
    })
    .to(element, {
      filter: "brightness(1.2)",
      textShadow: glow(16, 28),
      duration: 0.33,
      ease: "power1.inOut",
    })
    .to(element, {
      filter: "brightness(0.5)",
      textShadow: glow(7, 10),
      duration: 0.055,
      ease: "power1.in",
    })
    .to(element, {
      filter: "brightness(2.2)",
      textShadow: glow(32, 54),
      duration: 0.065,
      ease: "power1.out",
    })
    .to(element, {
      filter: "brightness(0.7)",
      textShadow: glow(9, 14),
      duration: 0.045,
      ease: "power1.in",
    })
    .to(element, {
      filter: "brightness(1.2)",
      textShadow: glow(18, 30),
      duration: 0.13,
      ease: "power2.out",
    })
    .to(element, {
      opacity: 0,
      filter: "brightness(0.1)",
      textShadow: `0 0 0 ${color}`,
      duration: 0.33,
      ease: "power2.in",
    });
}

export function playPopupIn(element: HTMLElement) {
  gsap.killTweensOf(element);
  gsap.set(element, {
    opacity: 0,
    scale: 0.96,
    filter: "blur(3.2px) brightness(2.8)",
  });
  gsap
    .timeline()
    .to(element, {
      opacity: 1,
      filter: "blur(1.4px) brightness(3.1)",
      scale: 1.03,
      duration: 0.11,
      ease: "power2.out",
    })
    .to(element, {
      filter: "blur(0.2px) brightness(1.12)",
      scale: 1,
      duration: 0.17,
      ease: "expo.out",
    });
}

// Flickers the popup off, then calls onComplete so it can leave the DOM.
export function playPopupOut(element: HTMLElement, onComplete: () => void) {
  gsap.killTweensOf(element);
  gsap
    .timeline({ onComplete })
    .to(element, {
      opacity: 0.24,
      filter: "blur(0.7px) brightness(0.55)",
      duration: 0.045,
      ease: "power1.in",
    })
    .to(element, {
      opacity: 1,
      filter: "blur(0.3px) brightness(2.5)",
      duration: 0.055,
      ease: "power2.out",
    })
    .to(element, {
      opacity: 0.21,
      filter: "blur(2px) brightness(0.25)",
      duration: 0.036,
      ease: "power1.in",
    })
    .to(element, {
      opacity: 1,
      filter: "blur(0.5px) brightness(1.3)",
      duration: 0.055,
      ease: "power2.out",
    })
    .to(element, {
      opacity: 0,
      filter: "blur(7px) brightness(0.12)",
      scale: 0.98,
      duration: 0.17,
      ease: "power1.in",
    });
}
