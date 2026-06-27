import { canEditBlockText } from "../../blocks/blockCapabilities.js";
import { focusEditable } from "../textEditing.js";

export function shouldStartTextEditFromPointerUp({ block, wasSelected, activeSelectionIds, moved, pickedUp }) {
  return wasSelected
    && activeSelectionIds.length === 1
    && !moved
    && !pickedUp
    && canEditBlockText(block);
}

export function startTextEditFromPointerUp({ block, controller }) {
  controller.startTextEdit(block.id);
  focusEditable(block.id);
}
