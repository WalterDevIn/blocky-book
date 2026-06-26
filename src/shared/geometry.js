import { PAGE_SPEC } from "../document/printSpec.js";

export function snapMm(value, stepMm = PAGE_SPEC.gridMm) {
  return Math.round(value / stepMm) * stepMm;
}

export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export function pointerToPageMm(event, pageElement, pageSpec = PAGE_SPEC) {
  const rect = pageElement.getBoundingClientRect();

  return {
    x: (event.clientX - rect.left) * (pageSpec.widthMm / rect.width),
    y: (event.clientY - rect.top) * (pageSpec.heightMm / rect.height),
  };
}

export function constrainFrameToPage(frame, pageSpec = PAGE_SPEC) {
  return {
    x: clamp(frame.x, 0, pageSpec.widthMm - frame.width),
    y: clamp(frame.y, 0, pageSpec.heightMm - frame.height),
    width: clamp(frame.width, pageSpec.gridMm, pageSpec.widthMm - frame.x),
    height: clamp(frame.height, pageSpec.gridMm, pageSpec.heightMm - frame.y),
  };
}

export function frameToCss(frame) {
  return {
    left: `${frame.x}mm`,
    top: `${frame.y}mm`,
    width: `${frame.width}mm`,
    height: `${frame.height}mm`,
  };
}

export function safeReleasePointerCapture(element, pointerId) {
  try {
    if (element.hasPointerCapture?.(pointerId)) {
      element.releasePointerCapture(pointerId);
    }
  } catch {
    // DOM can be rebuilt while dragging; releasing capture is best-effort.
  }
}
