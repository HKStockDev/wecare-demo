const FLAG = "wecare_pending_login_toast";

/** Call right after a successful login so the next shell can show unread toasts. */
export function markLoginToastPending() {
  try {
    sessionStorage.setItem(FLAG, "1");
  } catch {
    /* ignore */
  }
}

/** Returns true once if a login toast is pending, then clears the flag. */
export function consumeLoginToastPending(): boolean {
  try {
    if (sessionStorage.getItem(FLAG) !== "1") return false;
    sessionStorage.removeItem(FLAG);
    return true;
  } catch {
    return false;
  }
}

/** Peek without clearing — used while notification lists are still loading. */
export function hasLoginToastPending(): boolean {
  try {
    return sessionStorage.getItem(FLAG) === "1";
  } catch {
    return false;
  }
}
