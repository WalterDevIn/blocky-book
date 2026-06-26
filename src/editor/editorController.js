import { BLOCK_TYPES } from "../blocks/blockTypes.js";
import {
  addBlockToPage,
  addSpread as addSpreadToDocument,
  deleteBlock,
  updateBlockFrame as updateDocumentBlockFrame,
  updateBlockProps as updateDocumentBlockProps,
} from "../document/documentCommands.js";
import { findBlockById, getFirstPage } from "../document/documentQueries.js";

export function createEditorController({ editorState, render }) {
  function commitTextEdit(readText) {
    const blockId = editorState.interaction.editingBlockId;
    if (!blockId) return;

    const text = readText?.(blockId);
    if (typeof text === "string") {
      updateDocumentBlockProps(editorState.document, blockId, { text: text.trim() || "Texto" });
    }

    editorState.interaction.editingBlockId = null;
    editorState.interaction.mode = "idle";
  }

  return {
    addTextBlock() {
      const page = getFirstPage(editorState.document);
      const block = addBlockToPage(editorState.document, page.id, BLOCK_TYPES.text);
      editorState.selection = { blockId: block.id, pageId: page.id };
      editorState.interaction.contextMenu = null;
      editorState.interaction.editingBlockId = null;
      render();
    },

    addSpread() {
      addSpreadToDocument(editorState.document);
      editorState.interaction.contextMenu = null;
      render();
    },

    deleteSelectedBlock() {
      const blockId = editorState.selection.blockId;
      if (!blockId) return;

      if (deleteBlock(editorState.document, blockId)) {
        editorState.selection = { blockId: null, pageId: null };
        editorState.interaction.editingBlockId = null;
        editorState.interaction.contextMenu = null;
        render();
      }
    },

    selectBlock(blockId, pageId) {
      editorState.selection = { blockId, pageId };
      editorState.interaction.contextMenu = null;
      render();
    },

    clearSelection(readText) {
      commitTextEdit(readText);
      editorState.selection = { blockId: null, pageId: null };
      editorState.interaction.contextMenu = null;
      render();
    },

    startTextEdit(blockId) {
      const found = findBlockById(editorState.document, blockId);
      if (!found) return;

      editorState.selection = { blockId, pageId: found.page.id };
      editorState.interaction.editingBlockId = blockId;
      editorState.interaction.contextMenu = null;
      render();
    },

    commitTextEdit(readText) {
      commitTextEdit(readText);
      render();
    },

    cancelTextEdit() {
      editorState.interaction.editingBlockId = null;
      editorState.interaction.mode = "idle";
      render();
    },

    updateBlockFrame(blockId, frame) {
      updateDocumentBlockFrame(editorState.document, blockId, frame);
      render();
    },

    updateBlockProps(blockId, props) {
      updateDocumentBlockProps(editorState.document, blockId, props);
      render();
    },

    openBlockContextMenu(blockId, clientX, clientY, readText) {
      commitTextEdit(readText);
      const found = findBlockById(editorState.document, blockId);
      if (!found) return;

      editorState.selection = { blockId, pageId: found.page.id };
      editorState.interaction.contextMenu = {
        kind: "block-properties",
        blockId,
        x: clientX,
        y: clientY,
      };
      render();
    },

    closeContextMenu() {
      editorState.interaction.contextMenu = null;
      render();
    },

    toggleGrid() {
      editorState.viewport.showGrid = !editorState.viewport.showGrid;
      render();
    },
  };
}
