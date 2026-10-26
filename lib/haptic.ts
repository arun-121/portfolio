/**
 * A light haptic tick for touch taps. Android uses the vibration API. iOS Safari has no
 * vibration API, but toggling a native `switch` checkbox (iOS 18+) plays the system tick,
 * so a hidden one is clicked instead. Call only from inside a user gesture.
 */
let iosSwitch: HTMLLabelElement | null = null;

export function haptic() {
  if (typeof window === "undefined") return;
  if (typeof navigator.vibrate === "function") {
    navigator.vibrate(9);
    return;
  }
  if (!iosSwitch) {
    iosSwitch = document.createElement("label");
    iosSwitch.setAttribute("aria-hidden", "true");
    iosSwitch.style.cssText = "position:fixed;top:0;left:0;width:1px;height:1px;opacity:0;overflow:hidden;pointer-events:none;";
    const input = document.createElement("input");
    input.type = "checkbox";
    input.setAttribute("switch", "");
    input.tabIndex = -1;
    iosSwitch.appendChild(input);
    document.body.appendChild(iosSwitch);
  }
  const active = document.activeElement as HTMLElement | null;
  iosSwitch.click();
  active?.focus?.({ preventScroll: true });
}
