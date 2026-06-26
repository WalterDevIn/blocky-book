import { findBlockById } from "../document/documentQueries.js";

export function getSelectedBlockIds(editorState) {
  if (Array.isArray(editorState.selection.blockIds) && editorState.selection.blockIds.length > 0) {
    return editorState.selection.blockIds;
  }

  return editorState.selection.blockId ? [editorState.selection.blockId] : [];
}

export function isBlockSelected(editorState, blockId) {
  return getSelectedBlockIds(editorState).includes(blockId);
}

export function getSelectedBlocks(editorState) {
  return getSelectedBlockIds(editorState)
    .map((blockId) => findBlockById(editorState.document, blockId))
    .filter(Boolean);
}

export function getPrimarySelectedBlock(editorState) {
  const blockId = editorState.selection.blockId ?? getSelectedBlockIds(editorState)[0];
  if (!blockId) return null;
  return findBlockById(editorState.document, blockId);
}

export function createSelection(blockIds, pageId = null) {
  const normalizedIds = [...new Set(blockIds)].filter(Boolean);

  return {
    blockId: normalizedIds[0] ?? null,
    blockIds: normalizedIds,
    pageId,
  };
}
