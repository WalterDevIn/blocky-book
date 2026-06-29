import { safeReleasePointerCapture } from "../../shared/geometry.js";
import { createSelection, getSelectedBlockIds } from "../selectionHelpers.js";
import { readEditedText } from "../textEditing.js";
import { createBlockDragPreview } from "./blockDragPreview.js";
import {
  commitMovedBlockDrop,
  commitPlainSelection,
  commitUnmovedPickedBlock,
} from "./dropCommit.js";
import { createDragSelection, hasPointerMovedPastThreshold } from "./dragIntent.js";
import { getDraggedFrame, getPointerOffsetInBlockMm, getPointerOffsetInElementPx } from "./frameMath.js";
import { HOLD_TO_PICKUP_MS } from "./interactionConstants.js";
import { getPageElementUnderPointer, getPageIdFromElement } from "./pageHitTesting.js";
import { shouldStartTextEditFromPointerUp, startTextEditFromPointerUp } from "./textEditGesture.js";

export function startBlockDragSession({ event, block, page, pageElement, editorState, controller }) {
  if (event.button !== 0) return;

  event.stopPropagation();
  event.preventDefault();

  const blockElement = event.currentTarget;
  const { activeSelectionIds, wasSelected } = createDragSelection({
    block,
    editorState,
    getSelectedBlockIds,
  });
  const pointerOffsetMm = getPointerOffsetInBlockMm(event, block, pageElement);
  const pointerOffsetPx = getPointerOffsetInElementPx(event, blockElement);
  const startClient = { x: event.clientX, y: event.clientY };
  const preview = createBlockDragPreview({
    block,
    blockElement,
    editorState,
    pageElement,
    pointerOffsetPx,
    activeSelectionIds,
  });

  let moved = false;
  let pickedUp = false;
  let released = false;
  let activePageElement = pageElement;
  let latestFrame = { ...block.frame };
  let latestPageId = page.id;

  function beginPickup(pickupEvent, targetPageId = page.id) {
    if (pickedUp || released) return;

    pickedUp = true;
    latestPageId = targetPageId;
    preview.begin(pickupEvent, targetPageId);
  }

  const holdTimer = window.setTimeout(() => {
    beginPickup(event, page.id);
  }, HOLD_TO_PICKUP_MS);

  controller.commitTextEdit(readEditedText, { shouldRender: false });
  editorState.selection = createSelection(activeSelectionIds, page.id);
  editorState.interaction.contextMenu = null;

  pageElement.setPointerCapture?.(event.pointerId);

  const move = (moveEvent) => {
    if (hasPointerMovedPastThreshold(moveEvent, startClient)) {
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
    preview.move(moveEvent, {
      x: latestFrame.x - block.frame.x,
      y: latestFrame.y - block.frame.y,
    });
  };

  const up = (upEvent) => {
    released = true;
    window.clearTimeout(holdTimer);
    safeReleasePointerCapture(pageElement, upEvent.pointerId);
    window.removeEventListener("pointermove", move);
    window.removeEventListener("pointerup", up);

    preview.clearSource();

    if (shouldStartTextEditFromPointerUp({ block, wasSelected, activeSelectionIds, moved, pickedUp })) {
      preview.clearGroup();
      preview.removeGhost();
      startTextEditFromPointerUp({ block, controller });
      return;
    }

    if (pickedUp) {
      preview.clearGroup();

      if (moved) {
        commitMovedBlockDrop({
          event: upEvent,
          activePageElement,
          latestPageId,
          latestFrame,
          block,
          activeSelectionIds,
          controller,
        });
        preview.dropGhost();
        return;
      }

      preview.dropGhost();
      commitUnmovedPickedBlock({ activeSelectionIds, page, controller });
      return;
    }

    preview.clearGroup();
    preview.removeGhost();
    commitPlainSelection({ activeSelectionIds, page, controller });
  };

  window.addEventListener("pointermove", move);
  window.addEventListener("pointerup", up);
}
