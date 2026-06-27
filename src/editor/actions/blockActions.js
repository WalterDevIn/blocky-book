import { BLOCK_TYPES } from "../../blocks/blockTypes.js";
import {
  addBlockToPage,
  deleteBlocks,
  moveBlocksToPage,
  moveBlockToPage,
  translateBlocks,
  updateBlockFrame as updateDocumentBlockFrame,
  updateBlockProps as updateDocumentBlockProps,
  updateBlocksProps as updateDocumentBlocksProps,
} from "../../document/documentCommands.js";
import { findBlockById, getFirstPage } from "../../document/documentQueries.js";
import { createSelection, getSelectedBlockIds } from "../selectionHelpers.js";

const DROP_ANIMATION_MS = 180;

export function createBlockActions({ editorState, render, mutateDocument }) {
  function commitTextEdit(readText, { shouldRender = true } = {}) {
    const blockId = editorState.interaction.editingBlockId;
    if (!blockId) return;

    const text = readText?.(blockId);
    if (typeof text === "string") {
      mutateDocument((documentModel) => updateDocumentBlockProps(documentModel, blockId, { text }));
    }

    editorState.interaction.editingBlockId = null;
    editorState.interaction.mode = "idle";

    if (shouldRender) render();
  }

  function addBlock(type) {
    const page = getFirstPage(editorState.document);
    const block = mutateDocument((documentModel) => addBlockToPage(documentModel, page.id, type));
    editorState.selection = createSelection([block.id], page.id);
    editorState.interaction.contextMenu = null;
    editorState.interaction.editingBlockId = null;
    render();
  }

  return {
    addBlock,

    addTextBlock() {
      addBlock(BLOCK_TYPES.text);
    },

    deleteSelectedBlock() {
      const blockIds = getSelectedBlockIds(editorState);
      if (blockIds.length === 0) return;

      const deleted = mutateDocument((documentModel) => deleteBlocks(documentModel, blockIds));
      if (deleted) {
        editorState.selection = createSelection([]);
        editorState.interaction.editingBlockId = null;
        editorState.interaction.pickingBlockId = null;
        editorState.interaction.draggingBlockId = null;
        editorState.interaction.droppingBlockId = null;
        editorState.interaction.contextMenu = null;
        render();
      }
    },

    commitTextEdit,

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
        mutateDocument((documentModel) => {
          if (found.page.id !== targetPageId) {
            moveBlocksToPage(documentModel, selectedIds, targetPageId);
          }

          translateBlocks(documentModel, selectedIds, delta);
        });
        editorState.selection = createSelection(selectedIds, targetPageId);
      } else {
        const movedBlock = mutateDocument((documentModel) => {
          const nextBlock = moveBlockToPage(documentModel, blockId, targetPageId);
          if (!nextBlock) return null;

          updateDocumentBlockFrame(documentModel, blockId, frame);
          return nextBlock;
        });
        if (!movedBlock) return;

        editorState.selection = createSelection([blockId], targetPageId);
      }

      editorState.interaction.mode = "idle";
      editorState.interaction.pickingBlockId = null;
      editorState.interaction.draggingBlockId = null;
      editorState.interaction.contextMenu = null;
      if (shouldRender) render();
    },

    commitBlockResize(blockId, frame, { shouldRender = true } = {}) {
      mutateDocument((documentModel) => updateDocumentBlockFrame(documentModel, blockId, frame));
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
      mutateDocument((documentModel) => updateDocumentBlockFrame(documentModel, blockId, frame));
      render();
    },

    updateBlockProps(blockId, props) {
      mutateDocument((documentModel) => updateDocumentBlockProps(documentModel, blockId, props));
      render();
    },

    updateSelectedBlockProps(props) {
      const blockIds = getSelectedBlockIds(editorState);
      if (blockIds.length === 0) return;

      mutateDocument((documentModel) => updateDocumentBlocksProps(documentModel, blockIds, props));
      render();
    },
  };
}
