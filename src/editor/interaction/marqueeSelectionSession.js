import { pointerToPageMm, safeReleasePointerCapture } from "../../shared/geometry.js";

const MIN_MARQUEE_SIZE_MM = 1;

export function startMarqueeSelectionSession({ event, page, pageElement, editorState, controller }) {
  if (event.button !== 0 && event.button !== 2) return false;

  event.preventDefault();
  event.stopPropagation();

  const start = pointerToPageMm(event, pageElement, editorState.document.pageSpec);
  const marqueeElement = createMarqueeElement(pageElement);
  let latestSelectedIds = [];
  let hasMoved = false;

  pageElement.setPointerCapture?.(event.pointerId);

  const move = (moveEvent) => {
    const latest = pointerToPageMm(moveEvent, pageElement, editorState.document.pageSpec);
    const rect = getSelectionRect(start, latest);
    hasMoved = rect.width >= MIN_MARQUEE_SIZE_MM || rect.height >= MIN_MARQUEE_SIZE_MM;

    setMarqueeFrame(marqueeElement, rect);

    latestSelectedIds = hasMoved
      ? getIntersectingBlockIds(page.blocks, rect)
      : [];
    paintLiveSelection(pageElement, latestSelectedIds);
  };

  const up = (upEvent) => {
    safeReleasePointerCapture(pageElement, upEvent.pointerId);
    window.removeEventListener("pointermove", move);
    window.removeEventListener("pointerup", up);
    marqueeElement.remove();

    if (!hasMoved) {
      clearLiveSelection(pageElement);
      controller.clearSelection();
      return;
    }

    controller.selectBlocks(latestSelectedIds, page.id);
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

function getIntersectingBlockIds(blocks, rect) {
  return blocks
    .filter((block) => framesIntersect(block.frame, rect))
    .map((block) => block.id);
}

function framesIntersect(frame, rect) {
  return frame.x < rect.x + rect.width
    && frame.x + frame.width > rect.x
    && frame.y < rect.y + rect.height
    && frame.y + frame.height > rect.y;
}

function paintLiveSelection(pageElement, blockIds) {
  const selectedIds = new Set(blockIds);

  pageElement.querySelectorAll(".block[data-block-id]").forEach((blockElement) => {
    blockElement.classList.toggle("is-selected", selectedIds.has(blockElement.dataset.blockId));
  });
}

function clearLiveSelection(pageElement) {
  pageElement.querySelectorAll(".block[data-block-id]").forEach((blockElement) => {
    blockElement.classList.remove("is-selected");
  });
}
