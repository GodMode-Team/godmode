import { html } from "lit";
import { repeat } from "lit/directives/repeat.js";
import type { Toast } from "../toast";

type ToastProps = {
  toasts: Toast[];
  onDismiss: (id: string) => void;
};

const iconForType = (type: Toast["type"]) => {
  switch (type) {
    case "success":
      return html`
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle cx="8" cy="8" r="7" />
          <path d="M5 8l2 2 4-4" />
        </svg>
      `;
    case "error":
      return html`
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle cx="8" cy="8" r="7" />
          <path d="M8 4v4M8 11h.01" />
        </svg>
      `;
    case "warning":
      return html`
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M8 1l7 13H1L8 1z" />
          <path d="M8 6v3M8 12h.01" />
        </svg>
      `;
    case "info":
    default:
      return html`
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle cx="8" cy="8" r="7" />
          <path d="M8 11V8M8 5h.01" />
        </svg>
      `;
  }
};

export function renderToasts({ toasts, onDismiss }: ToastProps) {
  if (toasts.length === 0) {
    return null;
  }

  return html`
    <div class="toast-container">
      ${repeat(
        toasts,
        (toast) => toast.id,
        (toast) => html`
          <div class="toast toast--${toast.type}">
            <div class="toast__icon">${iconForType(toast.type)}</div>
            <div class="toast__body">
              <div class="toast__message">${toast.message}</div>
              ${toast.action
                ? html`${toast.action.url
                    ? html`<a
                        class="toast__action"
                        href=${toast.action.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >${toast.action.label} &rarr;</a>`
                    : html`<button
                        class="toast__action"
                        @click=${() => {
                          toast.action!.onClick?.();
                          onDismiss(toast.id);
                        }}
                      >${toast.action.label}</button>`}`
                : nothing}
            </div>
            <button
              class="toast__close"
              @click=${() => onDismiss(toast.id)}
              aria-label="Dismiss notification"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <path d="M1 1l12 12M13 1L1 13"/>
              </svg>
            </button>
          </div>
        `,
      )}
    </div>
  `;
}
