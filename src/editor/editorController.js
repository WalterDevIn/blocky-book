import { BLOCK_TYPES } from "../blocks/blockTypes.js";
import {
  addBlockToPage,
  addSpread as addSpreadToDocument,
  cloneBlockToPage,
  deleteBlocks,
  moveBlockToPage,
  translateBlocks,
  updateBlockFrame as updateDocumentBlockFrame,
  updateBlockProps as updateDocumentBlockProps,
  updateBlocksProps as updateDocumentBlocksProps,
} from "../document/documentCommands.js";
import { findBlockById, getFirstPage } from "../document/documentQueries.js";
import { saveStoredDocument } from "../document/documentStorage.js";
import { updateEditorSettings } from "../settings/editorSettingsStorage.js";
import { createSelection, getSelectedBlockIds } from "./selectionHelpers.js";

const DROP_ANIMATION_MS = 180;

export function createEditorController({ editorState, render }) {
  function commitTextEdit(readText, { shouldRender = true } = {}) {
    const blockId = editorState.interaction.editingBlockId;
    if (!blockId) return;

    const text = readText?.(blockId);
    if (typeof text === "string") {
      updateDocumentBlockProps(editorState.document, blockId, { text });
      saveDocument();
    }

    editorState.interaction.editingBlockId = null;
    editorState.interaction.mode = "idle";

    if (shouldRender) render();
  }

  function addBlock(type) {
    const page = getFirstPage(editorState.document);
    const block = addBlockToPage(editorState.document, page.id, type);
    editorState.selection = createSelection([block.id], page.id);
    editorState.interaction.contextMenu = null;
    editorState.interaction.editingBlockId = null;
    saveDocument();
    render();
  }

  function saveDocument() {
    saveStoredDocument(editorState.document);
  }

  return {
    addBlock,

    addTextBlock() {
      addBlock(BLOCK_TYPES.text);
    },

    addSpread() {
      addSpreadToDocument(editorState.document);
      editorState.interaction.contextMenu = null;
      saveDocument();
      render();
    },

    deleteSelectedBlock() {
      const blockIds = getSelectedBlockIds(editorState);
      if (blockIds.length === 0) return;

      if (deleteBlocks(editorState.document, blockIds)) {
        editorState.selection = createSelection([]);
        editorState.interaction.editingBlockId = null;
        editorState.interaction.pickingBlockId = null;
        editorState.interaction.draggingBlockId = null;
        editorState.interaction.droppingBlockId = null;
        editorState.interaction.contextMenu = null;
        saveDocument();
        render();
      }
    },

    copySelectedBlock() {
      const found = findBlockById(editorState.document, editorState.selection.blockId);
      if (!found) return;

      editorState.clipboard.block = structuredClone(found.block);
    },

    pasteCopiedBlock() {
      const copiedBlock = editorState.clipboard.block;
      if (!copiedBlock) return;

      const targetPageId = editorState.selection.pageId ?? getFirstPage(editorState.document)?.id;
      const block = cloneBlockToPage(editorState.document, copiedBlock, targetPageId);
      if (!block) return;

      editorState.selection = createSelection([block.id], targetPageId);
      editorState.interaction.contextMenu = null;
      editorState.interaction.editingBlockId = null;
      editorState.clipboard.block = structuredClone(block);
      saveDocument();
      render();
    },

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

    commitTextEdit(readText, options) {
      commitTextEdit(readText, options);
    },

    cancelTextEdit() {
      editorState.interaction.editingBlockId = null;
      editorState.interaction.mode = "idle";
      render();
    },

    commitBlockMove(blockId, targetPageId, frame, { shouldRender = true } = {}) {
      const selectedIds = getSelectedBlockIds(editorState);
      const isGroupMove = selectedIds.length > 1 && selectedIds.includes(blockId);

      if (isGroupMove) {
        const found = findBlockById(editorState.document, blockId);
        if (!found) return;

        const delta = {
          x: frame.x - found.block.frame.x,
          y: frame.y - found.block.frame.y,
        };
        translateBlocks(editorState.document, selectedIds, delta);
        editorState.selection = createSelection(selectedIds, found.page.id);
      } else {
        const movedBlock = moveBlockToPage(editorState.document, blockId, targetPageId);
        if (!movedBlock) return;

        updateDocumentBlockFrame(editorState.document, blockId, frame);
        editorState.selection = createSelection([blockId], targetPageId);
      }

      editorState.interaction.mode = "idle";
      editorState.interaction.pickingBlockId = null;
      editorState.interaction.draggingBlockId = null;
      editorState.interaction.contextMenu = null;
      saveDocument();
      if (shouldRender) render();
    },

    commitBlockResize(blockId, frame, { shouldRender = true } = {}) {
      updateDocumentBlockFrame(editorState.document, blockId, frame);
      saveDocument();
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
      saveDocument();
      render();
    },

    updateBlockProps(blockId, props) {
      updateDocumentBlockProps(editorState.document, blockId, props);
      saveDocument();
      render();
    },

    updateSelectedBlockProps(props) {
      const blockIds = getSelectedBlockIds(editorState);
      if (blockIds.length === 0) return;

      updateDocumentBlocksProps(editorState.document, blockIds, props);
      saveDocument();
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
      saveDocument();
      render();
    },

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
