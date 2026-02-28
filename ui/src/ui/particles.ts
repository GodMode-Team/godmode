/**
 * Quantum particles — lightweight floating gold specks for the Lifetrack theme.
 *
 * Creates absolutely-positioned <div> elements inside .shell so they live in the
 * same stacking context as the content. Particles sit at z-index 1 (above the
 * ambient gradient pseudo-elements at z-index 0, below actual content).
 * Content areas are made translucent in the lifetrack theme CSS so particles
 * show through softly.
 *
 * Uses requestAnimationFrame retry if .shell isn't rendered yet (theme applied
 * before first paint).
 */

const PARTICLE_COUNT = 56;
const CONTAINER_CLASS = "quantum-particles";
const PARTICLE_CLASS = "quantum-particle";

let container: HTMLDivElement | null = null;
let retryId: number | null = null;

function rand(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

export function initParticles(): void {
  destroyParticles();

  if (typeof document === "undefined") return;

  const shell = document.querySelector(".shell");
  if (!shell) {
    // Shell not rendered yet — retry on next frame
    retryId = requestAnimationFrame(() => {
      retryId = null;
      initParticles();
    });
    return;
  }

  container = document.createElement("div");
  container.className = CONTAINER_CLASS;
  Object.assign(container.style, {
    position: "fixed",
    inset: "0",
    pointerEvents: "none",
    zIndex: "1", // above ambient gradients (::before/::after at 0), below content
    overflow: "hidden",
  });

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const p = document.createElement("div");
    p.className = PARTICLE_CLASS;

    const size = rand(2, 5);
    const opacity = rand(0.3, 0.65);
    const duration = rand(15, 35);
    const delay = rand(0, 12);
    const startX = rand(5, 95);
    const startY = rand(5, 95);
    const driftX = rand(-150, 150);
    const driftY = rand(-200, 200);
    const driftEndX = rand(-250, 250);
    const driftEndY = rand(-350, 350);
    const scaleMid = rand(0.8, 1.5);

    // Standard CSS properties — gold with warm orange tint
    Object.assign(p.style, {
      position: "absolute",
      left: `${startX}%`,
      top: `${startY}%`,
      width: `${size}px`,
      height: `${size}px`,
      borderRadius: "50%",
      background: `rgba(235, 158, 15, ${rand(0.7, 1)})`,
      boxShadow: `0 0 ${size * 3}px rgba(235, 158, 15, ${opacity * 0.7})`,
      opacity: "0",
      willChange: "transform, opacity",
      animation: `quantum-float ${duration}s ${delay}s ease-in-out infinite`,
    });

    // Custom properties must use setProperty (Object.assign ignores --)
    p.style.setProperty("--particle-opacity", String(opacity));
    p.style.setProperty("--drift-x", `${driftX}px`);
    p.style.setProperty("--drift-y", `${driftY}px`);
    p.style.setProperty("--drift-end-x", `${driftEndX}px`);
    p.style.setProperty("--drift-end-y", `${driftEndY}px`);
    p.style.setProperty("--particle-scale-mid", String(scaleMid));

    container.appendChild(p);
  }

  // Prepend as first child of .shell — content siblings render on top in DOM order
  shell.prepend(container);
}

export function destroyParticles(): void {
  if (retryId !== null) {
    cancelAnimationFrame(retryId);
    retryId = null;
  }
  if (container) {
    container.remove();
    container = null;
  }
}
