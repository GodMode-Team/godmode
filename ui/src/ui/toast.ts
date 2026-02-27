export type ToastType = "success" | "error" | "warning" | "info";

export type Toast = {
  id: string;
  message: string;
  type: ToastType;
  duration: number; // milliseconds, 0 = persist until manually dismissed
  createdAt: number;
};

let toastCounter = 0;

export function createToast(message: string, type: ToastType = "info", duration = 3000): Toast {
  return {
    id: `toast-${Date.now()}-${toastCounter++}`,
    message,
    type,
    duration,
    createdAt: Date.now(),
  };
}

export function removeToast(toasts: Toast[], id: string): Toast[] {
  return toasts.filter((t) => t.id !== id);
}

export function addToast(toasts: Toast[], toast: Toast): Toast[] {
  return [...toasts, toast];
}
