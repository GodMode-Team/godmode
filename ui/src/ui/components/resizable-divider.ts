import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";

/**
 * A draggable divider for resizable split views.
 * Dispatches 'resize' events with { splitRatio: number } detail.
 *
 * direction="horizontal" (default) — side-by-side split, drag left/right.
 * direction="vertical" — top/bottom split, drag up/down.
 */
@customElement("resizable-divider")
export class ResizableDivider extends LitElement {
  @property({ type: Number }) splitRatio = 0.6;
  @property({ type: Number }) minRatio = 0.4;
  @property({ type: Number }) maxRatio = 0.7;
  @property({ type: String }) direction: "horizontal" | "vertical" = "horizontal";

  private isDragging = false;
  private startPos = 0;
  private startRatio = 0;

  static styles = css`
    :host {
      flex-shrink: 0;
      position: relative;
      transition: background 150ms ease-out;
    }

    :host([direction="vertical"]) {
      height: 4px;
      width: 100%;
      cursor: row-resize;
      background: var(--border, #333);
    }

    :host(:not([direction="vertical"])) {
      width: 4px;
      cursor: col-resize;
      background: var(--border, #333);
    }

    :host::before {
      content: "";
      position: absolute;
    }

    :host(:not([direction="vertical"]))::before {
      top: 0;
      left: -4px;
      right: -4px;
      bottom: 0;
    }

    :host([direction="vertical"])::before {
      left: 0;
      top: -4px;
      bottom: -4px;
      right: 0;
    }

    :host(:hover) {
      background: var(--accent, #007bff);
    }

    :host(.dragging) {
      background: var(--accent, #007bff);
    }
  `;

  render() {
    return html``;
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener("mousedown", this.handleMouseDown);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener("mousedown", this.handleMouseDown);
    document.removeEventListener("mousemove", this.handleMouseMove);
    document.removeEventListener("mouseup", this.handleMouseUp);
  }

  private handleMouseDown = (e: MouseEvent) => {
    this.isDragging = true;
    this.startPos = this.direction === "vertical" ? e.clientY : e.clientX;
    this.startRatio = this.splitRatio;
    this.classList.add("dragging");

    document.addEventListener("mousemove", this.handleMouseMove);
    document.addEventListener("mouseup", this.handleMouseUp);

    e.preventDefault();
  };

  private handleMouseMove = (e: MouseEvent) => {
    if (!this.isDragging) {
      return;
    }

    const container = this.parentElement;
    if (!container) {
      return;
    }

    const isVertical = this.direction === "vertical";
    const containerSize = isVertical
      ? container.getBoundingClientRect().height
      : container.getBoundingClientRect().width;
    const currentPos = isVertical ? e.clientY : e.clientX;
    const delta = currentPos - this.startPos;
    const deltaRatio = delta / containerSize;

    let newRatio = this.startRatio + deltaRatio;
    newRatio = Math.max(this.minRatio, Math.min(this.maxRatio, newRatio));

    this.dispatchEvent(
      new CustomEvent("resize", {
        detail: { splitRatio: newRatio },
        bubbles: true,
        composed: true,
      }),
    );
  };

  private handleMouseUp = () => {
    this.isDragging = false;
    this.classList.remove("dragging");

    document.removeEventListener("mousemove", this.handleMouseMove);
    document.removeEventListener("mouseup", this.handleMouseUp);
  };
}

declare global {
  interface HTMLElementTagNameMap {
    "resizable-divider": ResizableDivider;
  }
}
