import { BLOCK_TYPES } from "../blocks/blockTypes.js";
import {
  addBlockToPage,
  addSpread as addSpreadToDocument,
  deleteBlock,
  moveBlockToPage,
  updateBlockFrame as updateDocumentBlockFrame,
  updateBlockProps as updateDocumentBlockProps,
} from "../document/documentCommands.js";
import { findBlockById, getFirstPage } from "../document/documentQueries.js";

const PICKUP_ANIMATION_MS = 150;
const DROP_ANIMATION_MS = 180;

export function createEditorController({ editorState, render }) {
  function commitTextEdit(readText, { shouldRender = true } = {}) {
    const blockId = editorState.interaction.editingBlockId;
    if (!blockId) return;

    const text = readText?.(blockId);
    if (typeof text === "string") {
      updateDocumentBlockProps(editorState.document, blockId, { text: text.trim() || "Texto" });
    }

    editorState.interaction.editingBlockId = null;
    editorState.interaction.mode = "idle";

    if (shouldRender) render();
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
        editorState.interaction.pickingBlockId = null;
        editorState.interaction.draggingBlockId = null;
        editorState.interaction.droppingBlockId = null;
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
      commitTextEdit(readText, { shouldRender: false });
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

    commitTextEdit(readText, options) {
      commitTextEdit(readText, options);
    },

    cancelTextEdit() {
      editorState.interaction.editingBlockId = null;
      editorState.interaction.mode = "idle";
      render();
    },

    beginBlockPickup(blockId, pageId) {
      editorState.selection = { blockId, pageId };
      editorState.interaction.mode = "dragging-block";
      editorState.interaction.pickingBlockId = blockId;
      editorState.interaction.draggingBlockId = blockId;
      editorState.interaction.droppingBlockId = null;
      editorState.interaction.contextMenu = null;
      render();

      window.setTimeout(() => {
        if (editorState.interaction.pickingBlockId !== blockId) return;
        editorState.interaction.pickingBlockId = null;
        render();
      }, PICKUP_ANIMATION_MS);
    },

    moveBlock(blockId, targetPageId, frame) {
      const movedBlock = moveBlockToPage(editorState.document, blockId, targetPageId);
      if (!movedBlock) return;

      updateDocumentBlockFrame(editorState.document, blockId, frame);
      editorState.selection = { blockId, pageId: targetPageId };
      editorState.interaction.draggingBlockId = blockId;
      editorState.interaction.mode = "dragging-block";
      render();
    },

    endBlockDrag(blockId) {
      editorState.interaction.mode = "idle";
      editorState.interaction.pickingBlockId = null;
      editorState.interaction.draggingBlockId = null;
      editorState.interaction.droppingBlockId = blockId;
      render();

      window.setTimeout(() => {
        if (editorState.interaction.droppingBlockId !== blockId) return;
        editorState.interaction.droppingBlockId = null;
        render();
      }, DROP_ANIMATION_MS);
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
      commitTextEdit(readText, { shouldRender: false });
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
