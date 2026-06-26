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
import { updateEditorSettings } from "../settings/editorSettingsStorage.js";

const DROP_ANIMATION_MS = 180;

export function createEditorController({ editorState, render }) {
  function commitTextEdit(readText, { shouldRender = true } = {}) {
    const blockId = editorState.interaction.editingBlockId;
    if (!blockId) return;

    const text = readText?.(blockId);
    if (typeof text === "string") {
      updateDocumentBlockProps(editorState.document, blockId, { text });
    }

    editorState.interaction.editingBlockId = null;
    editorState.interaction.mode = "idle";

    if (shouldRender) render();
  }

  function addBlock(type) {
    const page = getFirstPage(editorState.document);
    const block = addBlockToPage(editorState.document, page.id, type);
    editorState.selection = { blockId: block.id, pageId: page.id };
    editorState.interaction.contextMenu = null;
    editorState.interaction.editingBlockId = null;
    render();
  }

  return {
    addBlock,

    addTextBlock() {
      addBlock(BLOCK_TYPES.text);
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

    selectBlock(blockId, pageId, { shouldRender = true } = {}) {
      editorState.selection = { blockId, pageId };
      editorState.interaction.contextMenu = null;
      if (shouldRender) render();
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

    commitBlockMove(blockId, targetPageId, frame, { shouldRender = true } = {}) {
      const movedBlock = moveBlockToPage(editorState.document, blockId, targetPageId);
      if (!movedBlock) return;

      updateDocumentBlockFrame(editorState.document, blockId, frame);
      editorState.selection = { blockId, pageId: targetPageId };
      editorState.interaction.mode = "idle";
      editorState.interaction.pickingBlockId = null;
      editorState.interaction.draggingBlockId = null;
      editorState.interaction.contextMenu = null;
      if (shouldRender) render();
    },

    commitBlockResize(blockId, frame, { shouldRender = true } = {}) {
      updateDocumentBlockFrame(editorState.document, blockId, frame);
      if (shouldRender) render();
    },

    endBlockDrop(blockId) {
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

    updatePageSize(patch) {
      const nextSettings = updateEditorSettings({ pageSpec: patch });
      editorState.settings = nextSettings;
      editorState.document.pageSpec = nextSettings.pageSpec;
      editorState.document.intent = {
        ...editorState.document.intent,
        snapUnitMm: nextSettings.pageSpec.gridMm,
      };
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

    togglePageMargin() {
      editorState.viewport.showPageMargin = !editorState.viewport.showPageMargin;
      render();
    },
  };
}
