import { GRID_MM, PAGE_HEIGHT_MM, PAGE_WIDTH_MM } from "./constants.js";

export function snap(value) {
  return Math.round(value / GRID_MM) * GRID_MM;
}

export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export function mmFromPointer(event, pageElement) {
  const rect = pageElement.getBoundingClientRect();
  const mmPerPxX = PAGE_WIDTH_MM / rect.width;
  const mmPerPxY = PAGE_HEIGHT_MM / rect.height;

  return {
    x: (event.clientX - rect.left) * mmPerPxX,
    y: (event.clientY - rect.top) * mmPerPxY,
  };
}

export function clampBlockPosition(block) {
  block.x = clamp(block.x, 0, PAGE_WIDTH_MM - block.width);
  block.y = clamp(block.y, 0, PAGE_HEIGHT_MM - block.height);
}

export function clampBlockSize(block) {
  block.width = clamp(block.width, GRID_MM, PAGE_WIDTH_MM - block.x);
  block.height = clamp(block.height, GRID_MM, PAGE_HEIGHT_MM - block.y);
}

export function safeReleasePointerCapture(element, pointerId) {
  try {
    if (element.hasPointerCapture?.(pointerId)) {
      element.releasePointerCapture(pointerId);
    }
  } catch {
    // The DOM can be re-rendered during interaction; pointer capture release is best-effort.
  }
}
