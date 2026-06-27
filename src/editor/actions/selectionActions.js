import { findBlockById } from "../../document/documentQueries.js";
import { createSelection } from "../selectionHelpers.js";

export function createSelectionActions({ editorState, render, commitTextEdit }) {
  return {
    selectBlock(blockId, pageId, { shouldRender = true } = {}) {
      editorState.selection = createSelection([blockId], pageId);
      editorState.interaction.contextMenu = null;
      if (shouldRender) render();
    },

    selectBlocks(blockIds, pageId, { shouldRender = true } = {}) {
      editorState.selection = createSelection(blockIds, pageId);
      editorState.interaction.contextMenu = null;
      if (shouldRender) render();
    },

    clearSelection(readText) {
      commitTextEdit(readText, { shouldRender: false });
      editorState.selection = createSelection([]);
      editorState.interaction.contextMenu = null;
      render();
    },

    startTextEdit(blockId) {
      const found = findBlockById(editorState.document, blockId);
      if (!found) return;

      editorState.selection = createSelection([blockId], found.page.id);
      editorState.interaction.editingBlockId = blockId;
      editorState.interaction.contextMenu = null;
      render();
    },
  };
}
