export const DESKTOP_NOTICE_KEY = "ya-portfolio-desktop-notice-dismissed";

export function readDismissed(key: string): boolean {
  if (typeof window === "undefined") return true;
  try {
    return window.localStorage.getItem(key) === "1";
  } catch {
    return false;
  }
}

export function writeDismissed(key: string) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, "1");
  } catch {
    // Ignore private-mode / blocked storage
  }
}
