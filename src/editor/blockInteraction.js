import { PAGE_SPEC } from "../document/printSpec.js";
import { clamp, pointerToPageMm, safeReleasePointerCapture, snapMm } from "../shared/geometry.js";
import { focusEditable, readEditedText } from "./textEditing.js";

const CLICK_MOVE_THRESHOLD_PX = 4;

export function handleBlockPointerDown({ event, block, page, pageElement, editorState, controller }) {
  event.stopPropagation();

  const wasSelected = editorState.selection.blockId === block.id;
  const startPointer = pointerToPageMm(event, pageElement);
  const startClient = { x: event.clientX, y: event.clientY };
  const startFrame = { ...block.frame };
  let moved = false;

  controller.commitTextEdit(readEditedText);
  editorState.selection = { blockId: block.id, pageId: page.id };
  editorState.interaction.contextMenu = null;

  pageElement.setPointerCapture?.(event.pointerId);

  const move = (moveEvent) => {
    const dxPx = Math.abs(moveEvent.clientX - startClient.x);
    const dyPx = Math.abs(moveEvent.clientY - startClient.y);

    if (dxPx > CLICK_MOVE_THRESHOLD_PX || dyPx > CLICK_MOVE_THRESHOLD_PX) {
      moved = true;
    }

    if (!moved) return;

    const current = pointerToPageMm(moveEvent, pageElement);
    const nextX = snapMm(startFrame.x + current.x - startPointer.x);
    const nextY = snapMm(startFrame.y + current.y - startPointer.y);

    controller.updateBlockFrame(block.id, {
      x: clamp(nextX, 0, PAGE_SPEC.widthMm - block.frame.width),
      y: clamp(nextY, 0, PAGE_SPEC.heightMm - block.frame.height),
    });
  };

  const up = (upEvent) => {
    safeReleasePointerCapture(pageElement, upEvent.pointerId);
    window.removeEventListener("pointermove", move);
    window.removeEventListener("pointerup", up);

    if (wasSelected && !moved) {
      controller.startTextEdit(block.id);
      focusEditable(block.id);
      return;
    }

    controller.selectBlock(block.id, page.id);
  };

  window.addEventListener("pointermove", move);
  window.addEventListener("pointerup", up);
}

export function handleResizePointerDown({ event, block, pageElement, controller }) {
  event.stopPropagation();

  const startPointer = pointerToPageMm(event, pageElement);
  const startFrame = { ...block.frame };

  pageElement.setPointerCapture?.(event.pointerId);

  const move = (moveEvent) => {
    const current = pointerToPageMm(moveEvent, pageElement);
    const nextWidth = snapMm(startFrame.width + current.x - startPointer.x);
    const nextHeight = snapMm(startFrame.height + current.y - startPointer.y);

    controller.updateBlockFrame(block.id, {
      width: clamp(nextWidth, PAGE_SPEC.gridMm, PAGE_SPEC.widthMm - block.frame.x),
      height: clamp(nextHeight, PAGE_SPEC.gridMm, PAGE_SPEC.heightMm - block.frame.y),
    });
  };

  const up = (upEvent) => {
    safeReleasePointerCapture(pageElement, upEvent.pointerId);
    window.removeEventListener("pointermove", move);
    window.removeEventListener("pointerup", up);
  };

  window.addEventListener("pointermove", move);
  window.addEventListener("pointerup", up);
}
