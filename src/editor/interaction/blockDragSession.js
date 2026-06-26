import { canEditBlockText } from "../../blocks/blockCapabilities.js";
import { safeReleasePointerCapture } from "../../shared/geometry.js";
import { focusEditable, readEditedText } from "../textEditing.js";
import { createDragGhost, dropDragGhost, moveDragGhost } from "./dragGhost.js";
import { getDraggedFrame, getPointerOffsetInBlockMm, getPointerOffsetInElementPx } from "./frameMath.js";
import { CLICK_MOVE_THRESHOLD_PX, HOLD_TO_PICKUP_MS } from "./interactionConstants.js";
import { getPageElementUnderPointer, getPageIdFromElement } from "./pageHitTesting.js";

export function startBlockDragSession({ event, block, page, pageElement, editorState, controller }) {
  event.stopPropagation();
  event.preventDefault();

  const blockElement = event.currentTarget;
  const wasSelected = editorState.selection.blockId === block.id;
  const pointerOffsetMm = getPointerOffsetInBlockMm(event, block, pageElement);
  const pointerOffsetPx = getPointerOffsetInElementPx(event, blockElement);
  const startClient = { x: event.clientX, y: event.clientY };

  let moved = false;
  let pickedUp = false;
  let released = false;
  let activePageElement = pageElement;
  let latestFrame = { ...block.frame };
  let latestPageId = page.id;
  let ghost = null;

  function beginPickup(pickupEvent, targetPageId = page.id) {
    if (pickedUp || released) return;

    pickedUp = true;
    latestPageId = targetPageId;
    editorState.selection = { blockId: block.id, pageId: targetPageId };
    editorState.interaction.mode = "dragging-block";
    editorState.interaction.pickingBlockId = block.id;
    editorState.interaction.draggingBlockId = block.id;
    editorState.interaction.droppingBlockId = null;
    editorState.interaction.contextMenu = null;

    blockElement.classList.add("is-drag-source");
    ghost = createDragGhost(blockElement, pickupEvent, pointerOffsetPx);
  }

  const holdTimer = window.setTimeout(() => {
    beginPickup(event, page.id);
  }, HOLD_TO_PICKUP_MS);

  controller.commitTextEdit(readEditedText, { shouldRender: false });
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

    const targetPageElement = getPageElementUnderPointer(moveEvent, activePageElement);
    const targetPageId = getPageIdFromElement(targetPageElement);

    if (!targetPageId) return;

    activePageElement = targetPageElement;
    latestPageId = targetPageId;
    latestFrame = getDraggedFrame(moveEvent, block, targetPageElement, pointerOffsetMm);

    beginPickup(moveEvent, targetPageId);
    moveDragGhost(ghost, moveEvent, pointerOffsetPx);
  };

  const up = (upEvent) => {
    released = true;
    window.clearTimeout(holdTimer);
    safeReleasePointerCapture(pageElement, upEvent.pointerId);
    window.removeEventListener("pointermove", move);
    window.removeEventListener("pointerup", up);

    blockElement.classList.remove("is-drag-source");

    if (wasSelected && !moved && !pickedUp && canEditBlockText(block)) {
      controller.startTextEdit(block.id);
      focusEditable(block.id);
      return;
    }

    if (pickedUp) {
      if (moved) {
        const dropPageElement = getPageElementUnderPointer(upEvent, activePageElement);
        const dropPageId = getPageIdFromElement(dropPageElement) ?? latestPageId;
        controller.commitBlockMove(block.id, dropPageId, latestFrame, { shouldRender: false });
        controller.selectBlock(block.id, dropPageId, { shouldRender: false });
        dropDragGhost(ghost);
        controller.endBlockDrop(block.id);
        return;
      }

      dropDragGhost(ghost);
      controller.selectBlock(block.id, page.id);
      return;
    }

    controller.selectBlock(block.id, page.id);
  };

  window.addEventListener("pointermove", move);
  window.addEventListener("pointerup", up);
}
