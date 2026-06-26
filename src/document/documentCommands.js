import { createBlock, createSpread } from "./documentFactory.js";
import { findBlockById, findPageById, getFirstPage } from "./documentQueries.js";
import { constrainFrameToPage } from "../shared/geometry.js";
import { mergePlainObjects } from "../shared/objectMerge.js";

export function addSpread(documentModel) {
  const spread = createSpread();
  documentModel.spreads.push(spread);
  return spread;
}

export function addBlockToPage(documentModel, pageId, type, overrides = {}) {
  const page = pageId
    ? documentModel.spreads.flatMap((spread) => spread.pages).find((candidate) => candidate.id === pageId)
    : getFirstPage(documentModel);

  if (!page) {
    throw new Error("Cannot add block because the target page does not exist.");
  }

  const block = createBlock(type, overrides);
  page.blocks.push(block);
  return block;
}

export function deleteBlock(documentModel, blockId) {
  const found = findBlockById(documentModel, blockId);
  if (!found) return false;

  found.page.blocks = found.page.blocks.filter((block) => block.id !== blockId);
  return true;
}

export function moveBlockToPage(documentModel, blockId, targetPageId) {
  const foundBlock = findBlockById(documentModel, blockId);
  const foundTarget = findPageById(documentModel, targetPageId);

  if (!foundBlock || !foundTarget) return null;
  if (foundBlock.page.id === foundTarget.page.id) return foundBlock.block;

  foundBlock.page.blocks = foundBlock.page.blocks.filter((block) => block.id !== blockId);
  foundTarget.page.blocks.push(foundBlock.block);

  return foundBlock.block;
}

export function updateBlockFrame(documentModel, blockId, nextFrame) {
  const found = findBlockById(documentModel, blockId);
  if (!found) return null;

  found.block.frame = constrainFrameToPage({
    ...found.block.frame,
    ...nextFrame,
  }, documentModel.pageSpec);

  return found.block;
}

export function updateBlockProps(documentModel, blockId, nextProps) {
  const found = findBlockById(documentModel, blockId);
  if (!found) return null;

  found.block.props = mergePlainObjects(found.block.props, nextProps);

  return found.block;
}
