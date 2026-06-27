import { CLICK_MOVE_THRESHOLD_PX } from "./interactionConstants.js";

export function hasPointerMovedPastThreshold(event, startClient) {
  const dxPx = Math.abs(event.clientX - startClient.x);
  const dyPx = Math.abs(event.clientY - startClient.y);

  return dxPx > CLICK_MOVE_THRESHOLD_PX || dyPx > CLICK_MOVE_THRESHOLD_PX;
}

export function createDragSelection({ block, editorState, getSelectedBlockIds }) {
  const selectedIdsAtStart = getSelectedBlockIds(editorState);
  const isPartOfSelection = selectedIdsAtStart.includes(block.id);

  return {
    activeSelectionIds: isPartOfSelection ? selectedIdsAtStart : [block.id],
    wasSelected: isPartOfSelection,
  };
}
