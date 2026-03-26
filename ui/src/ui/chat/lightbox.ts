import { html, nothing } from "lit";

export type LightboxImage = {
  url: string;
  alt?: string;
};

export type LightboxState = {
  open: boolean;
  images: LightboxImage[];
  currentIndex: number;
};

export function createLightboxState(): LightboxState {
  return { open: false, images: [], currentIndex: 0 };
}

export function openLightbox(
  url: string,
  allImages: LightboxImage[],
  index: number,
): LightboxState {
  return { open: true, images: allImages, currentIndex: index };
}

export function closeLightbox(): LightboxState {
  return createLightboxState();
}

export function lightboxNav(state: LightboxState, delta: number): LightboxState {
  const next = state.currentIndex + delta;
  if (next < 0 || next >= state.images.length) return state;
  return { ...state, currentIndex: next };
}

const svgX = html`<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;
const svgLeft = html`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>`;
const svgRight = html`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 6 15 12 9 18"/></svg>`;

export function renderLightbox(
  state: LightboxState,
  handlers: {
    onClose: () => void;
    onNav: (delta: number) => void;
  },
) {
  if (!state.open || state.images.length === 0) return nothing;

  const img = state.images[state.currentIndex];
  if (!img) return nothing;

  const hasMultiple = state.images.length > 1;
  const hasPrev = state.currentIndex > 0;
  const hasNext = state.currentIndex < state.images.length - 1;

  return html`
    <div
      class="lightbox-overlay"
      @click=${(e: MouseEvent) => {
        if ((e.target as HTMLElement).classList.contains("lightbox-overlay")) {
          handlers.onClose();
        }
      }}
      @keydown=${(e: KeyboardEvent) => {
        if (e.key === "Escape") handlers.onClose();
        if (e.key === "ArrowRight" && hasNext) handlers.onNav(1);
        if (e.key === "ArrowLeft" && hasPrev) handlers.onNav(-1);
      }}
      tabindex="0"
    >
      <button class="lightbox-close" @click=${handlers.onClose} aria-label="Close image viewer">
        ${svgX}
      </button>

      ${hasMultiple && hasPrev
        ? html`<button class="lightbox-nav lightbox-nav--prev" @click=${() => handlers.onNav(-1)} aria-label="Previous image">${svgLeft}</button>`
        : nothing}

      <img
        class="lightbox-image"
        src=${img.url}
        alt=${img.alt ?? "Image preview"}
        @click=${(e: Event) => e.stopPropagation()}
        @error=${(e: Event) => { (e.target as HTMLElement).classList.add("lightbox-image--broken"); }}
      />

      ${hasMultiple && hasNext
        ? html`<button class="lightbox-nav lightbox-nav--next" @click=${() => handlers.onNav(1)} aria-label="Next image">${svgRight}</button>`
        : nothing}

      ${hasMultiple
        ? html`<div class="lightbox-counter">${state.currentIndex + 1} / ${state.images.length}</div>`
        : nothing}
    </div>
  `;
}
