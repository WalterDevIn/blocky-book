import { pointerToPageMm, safeReleasePointerCapture } from "../../shared/geometry.js";

const MIN_MARQUEE_SIZE_MM = 1;

export function startMarqueeSelectionSession({ event, page, pageElement, editorState, controller }) {
  if (event.button !== 2) return false;

  event.preventDefault();
  event.stopPropagation();

  const start = pointerToPageMm(event, pageElement);
  const marqueeElement = createMarqueeElement(pageElement);
  let latest = start;
  let hasMoved = false;

  pageElement.setPointerCapture?.(event.pointerId);

  const move = (moveEvent) => {
    latest = pointerToPageMm(moveEvent, pageElement);
    const rect = getSelectionRect(start, latest);
    hasMoved = rect.width >= MIN_MARQUEE_SIZE_MM || rect.height >= MIN_MARQUEE_SIZE_MM;

    setMarqueeFrame(marqueeElement, rect);

    const blockIds = page.blocks
      .filter((block) => framesIntersect(block.frame, rect))
      .map((block) => block.id);

    controller.selectBlocks(blockIds, page.id);
  };

  const up = (upEvent) => {
    safeReleasePointerCapture(pageElement, upEvent.pointerId);
    window.removeEventListener("pointermove", move);
    window.removeEventListener("pointerup", up);
    marqueeElement.remove();

    if (hasMoved) {
      controller.openSelectionContextMenu(upEvent.clientX, upEvent.clientY);
      return;
    }

    controller.openSelectionContextMenu(upEvent.clientX, upEvent.clientY);
  };

  window.addEventListener("pointermove", move);
  window.addEventListener("pointerup", up);
  return true;
}

function createMarqueeElement(pageElement) {
  const marqueeElement = document.createElement("div");
  marqueeElement.className = "selection-marquee";
  pageElement.appendChild(marqueeElement);
  return marqueeElement;
}

function setMarqueeFrame(element, rect) {
  element.style.left = `${rect.x}mm`;
  element.style.top = `${rect.y}mm`;
  element.style.width = `${rect.width}mm`;
  element.style.height = `${rect.height}mm`;
}

function getSelectionRect(start, end) {
  const x = Math.min(start.x, end.x);
  const y = Math.min(start.y, end.y);

  return {
    x,
    y,
    width: Math.abs(end.x - start.x),
    height: Math.abs(end.y - start.y),
  };
}

function framesIntersect(frame, rect) {
  return frame.x < rect.x + rect.width
    && frame.x + frame.width > rect.x
    && frame.y < rect.y + rect.height
    && frame.y + frame.height > rect.y;
}
