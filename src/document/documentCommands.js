import { getMinimumFrameSize } from "../blocks/blockConstraints.js";
import { constrainFrameToPage } from "../shared/geometry.js";
import { mergePlainObjects } from "../shared/objectMerge.js";
import { createBlock, cloneSpread, createSpread, SPREAD_LAYOUTS } from "./documentFactory.js";
import { findBlockById, findPageById, getFirstPage } from "./documentQueries.js";

export function addSpread(documentModel) {
  return insertSpreadAfter(documentModel, documentModel.spreads.length - 1);
}

export function insertSpreadAfter(documentModel, spreadIndex) {
  const spread = createSpread({ layout: SPREAD_LAYOUTS.pair });
  documentModel.spreads.splice(spreadIndex + 1, 0, spread);
  return spread;
}

export function duplicateSpreadAfter(documentModel, spreadIndex) {
  const sourceSpread = documentModel.spreads[spreadIndex];
  if (!sourceSpread) return null;

  const spread = cloneSpread(sourceSpread);
  documentModel.spreads.splice(spreadIndex + 1, 0, spread);
  return spread;
}

export function deleteSpread(documentModel, spreadIndex) {
  if (documentModel.spreads.length <= 1) return null;
  const [deletedSpread] = documentModel.spreads.splice(spreadIndex, 1);
  return deletedSpread ?? null;
}

export function addFirstSinglePage(documentModel) {
  const existingIndex = documentModel.spreads.findIndex((spread) => spread.layout === SPREAD_LAYOUTS.singleStart);
  if (existingIndex >= 0) return documentModel.spreads[existingIndex];

  const spread = createSpread({ layout: SPREAD_LAYOUTS.singleStart });
  documentModel.spreads.unshift(spread);
  return spread;
}

export function addLastSinglePage(documentModel) {
  const existingIndex = documentModel.spreads.findIndex((spread) => spread.layout === SPREAD_LAYOUTS.singleEnd);
  if (existingIndex >= 0) return documentModel.spreads[existingIndex];

  const spread = createSpread({ layout: SPREAD_LAYOUTS.singleEnd });
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
  block.frame = constrainFrameToPage(block.frame, documentModel.pageSpec, getMinimumFrameSize(block));
  page.blocks.push(block);
  return block;
}

export function cloneBlockToPage(documentModel, sourceBlock, targetPageId, frameOffset = { x: 5, y: 5 }) {
  const page = targetPageId
    ? findPageById(documentModel, targetPageId)?.page
    : getFirstPage(documentModel);

  if (!page || !sourceBlock) return null;

  const block = createBlock(sourceBlock.type, {
    frame: constrainFrameToPage({
      ...sourceBlock.frame,
      x: sourceBlock.frame.x + frameOffset.x,
      y: sourceBlock.frame.y + frameOffset.y,
    }, documentModel.pageSpec, getMinimumFrameSize(sourceBlock)),
    props: structuredClone(sourceBlock.props),
  });

  page.blocks.push(block);
  return block;
}

export function deleteBlock(documentModel, blockId) {
  const found = findBlockById(documentModel, blockId);
  if (!found) return false;

  found.page.blocks = found.page.blocks.filter((block) => block.id !== blockId);
  return true;
}

export function deleteBlocks(documentModel, blockIds) {
  const ids = new Set(blockIds);
  let deleted = false;

  documentModel.spreads.forEach((spread) => {
    spread.pages.forEach((page) => {
      const nextBlocks = page.blocks.filter((block) => !ids.has(block.id));
      deleted = deleted || nextBlocks.length !== page.blocks.length;
      page.blocks = nextBlocks;
    });
  });

  return deleted;
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

export function moveBlocksToPage(documentModel, blockIds, targetPageId) {
  const foundTarget = findPageById(documentModel, targetPageId);
  if (!foundTarget) return [];

  const ids = new Set(blockIds);
  const movedBlocks = [];

  documentModel.spreads.forEach((spread) => {
    spread.pages.forEach((page) => {
      const remainingBlocks = [];

      page.blocks.forEach((block) => {
        if (ids.has(block.id)) {
          movedBlocks.push(block);
          return;
        }

        remainingBlocks.push(block);
      });

      page.blocks = remainingBlocks;
    });
  });

  foundTarget.page.blocks.push(...movedBlocks);
  return movedBlocks;
}

export function updateBlockFrame(documentModel, blockId, nextFrame) {
  const found = findBlockById(documentModel, blockId);
  if (!found) return null;

  found.block.frame = constrainFrameToPage({
    ...found.block.frame,
    ...nextFrame,
  }, documentModel.pageSpec, getMinimumFrameSize(found.block));

  return found.block;
}

export function translateBlocks(documentModel, blockIds, delta) {
  const blocks = blockIds
    .map((blockId) => findBlockById(documentModel, blockId)?.block)
    .filter(Boolean);
  const groupDelta = clampGroupDelta(blocks, delta, documentModel.pageSpec);

  blocks.forEach((block) => {
    block.frame = {
      ...block.frame,
      x: block.frame.x + groupDelta.x,
      y: block.frame.y + groupDelta.y,
    };
  });

  return blocks;
}

export function updateBlockProps(documentModel, blockId, nextProps) {
  const found = findBlockById(documentModel, blockId);
  if (!found) return null;

  found.block.props = mergePlainObjects(found.block.props, nextProps);

  return found.block;
}

export function updateBlocksProps(documentModel, blockIds, nextProps) {
  return blockIds
    .map((blockId) => updateBlockProps(documentModel, blockId, nextProps))
    .filter(Boolean);
}

function clampGroupDelta(blocks, delta, pageSpec) {
  const bounds = getGroupBounds(blocks);
  if (!bounds) return delta;

  return {
    x: clamp(delta.x, -bounds.x, pageSpec.widthMm - bounds.right),
    y: clamp(delta.y, -bounds.y, pageSpec.heightMm - bounds.bottom),
  };
}

function getGroupBounds(blocks) {
  if (blocks.length === 0) return null;

  const x = Math.min(...blocks.map((block) => block.frame.x));
  const y = Math.min(...blocks.map((block) => block.frame.y));
  const right = Math.max(...blocks.map((block) => block.frame.x + block.frame.width));
  const bottom = Math.max(...blocks.map((block) => block.frame.y + block.frame.height));

  return { x, y, right, bottom };
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}
