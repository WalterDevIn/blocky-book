import { createSpread } from "./documentModel.js";

export const state = {
  showGrid: true,
  selectedId: null,
  editingId: null,
  contextMenu: null,
  spreads: [],
};

export function resetDocument() {
  state.showGrid = true;
  state.selectedId = null;
  state.editingId = null;
  state.contextMenu = null;
  state.spreads = [createSpread()];
}

export function getSelectedBlock() {
  if (!state.selectedId) return null;

  for (const spread of state.spreads) {
    for (const page of spread.pages) {
      const block = page.blocks.find((item) => item.id === state.selectedId);
      if (block) return { block, page, spread };
    }
  }

  return null;
}

export function getBlockById(blockId) {
  for (const spread of state.spreads) {
    for (const page of spread.pages) {
      const block = page.blocks.find((item) => item.id === blockId);
      if (block) return { block, page, spread };
    }
  }

  return null;
}

export function finishCurrentEdit(readEditedText) {
  if (!state.editingId) return;

  const found = getBlockById(state.editingId);
  if (found) {
    const nextText = readEditedText?.(state.editingId);
    if (typeof nextText === "string") {
      found.block.text = nextText.trim() || "Texto";
    }
  }

  state.editingId = null;
}

export function deleteSelectedBlock() {
  if (!state.selectedId) return false;

  for (const spread of state.spreads) {
    for (const page of spread.pages) {
      const index = page.blocks.findIndex((block) => block.id === state.selectedId);
      if (index !== -1) {
        page.blocks.splice(index, 1);
        state.selectedId = null;
        state.editingId = null;
        state.contextMenu = null;
        return true;
      }
    }
  }

  return false;
}
