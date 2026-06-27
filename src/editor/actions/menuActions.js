import { findBlockById } from "../../document/documentQueries.js";
import { createSelection, getSelectedBlockIds } from "../selectionHelpers.js";

export function createMenuActions({ editorState, render, commitTextEdit }) {
  return {
    openBlockContextMenu(blockId, clientX, clientY, readText) {
      commitTextEdit(readText, { shouldRender: false });
      const found = findBlockById(editorState.document, blockId);
      if (!found) return;

      const selectedIds = getSelectedBlockIds(editorState);
      const nextIds = selectedIds.includes(blockId) ? selectedIds : [blockId];
      editorState.selection = createSelection(nextIds, found.page.id);
      editorState.interaction.contextMenu = {
        kind: "block-properties",
        blockId: nextIds[0],
        blockIds: nextIds,
        x: clientX,
        y: clientY,
      };
      render();
    },

    openSelectionContextMenu(clientX, clientY) {
      const blockIds = getSelectedBlockIds(editorState);
      if (blockIds.length === 0) return;

      editorState.interaction.contextMenu = {
        kind: "block-properties",
        blockId: blockIds[0],
        blockIds,
        x: clientX,
        y: clientY,
      };
      render();
    },

    closeContextMenu() {
      editorState.interaction.contextMenu = null;
      render();
    },
  };
}
