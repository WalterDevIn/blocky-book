import { getCommonStyle } from "../../blocks/blockStyle.js";
import { BLOCK_TYPES } from "../../blocks/blockTypes.js";
import { PAGE_SPEC } from "../../document/printSpec.js";
import { clamp, pointerToPageMm, snapMm } from "../../shared/geometry.js";

export function getPointerOffsetInBlockMm(event, block, pageElement) {
  const pointerInPage = pointerToPageMm(event, pageElement);

  return {
    x: pointerInPage.x - block.frame.x,
    y: pointerInPage.y - block.frame.y,
  };
}

export function getPointerOffsetInElementPx(event, element) {
  const rect = element.getBoundingClientRect();

  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  };
}

export function getDraggedFrame(event, block, targetPageElement, pointerOffsetMm) {
  const pointerMm = pointerToPageMm(event, targetPageElement);
  const snapStepMm = getBlockMoveSnapMm(block);

  return {
    x: clamp(snapMm(pointerMm.x - pointerOffsetMm.x, snapStepMm), 0, PAGE_SPEC.widthMm - block.frame.width),
    y: clamp(snapMm(pointerMm.y - pointerOffsetMm.y, snapStepMm), 0, PAGE_SPEC.heightMm - block.frame.height),
  };
}

export function getResizedFrame(event, { block, pageElement, startPointer, startFrame }) {
  const current = pointerToPageMm(event, pageElement);
  const snapStepMm = getBlockResizeSnapMm(block);
  const minSize = getBlockMinimumSize(block);
  const nextWidth = snapMm(startFrame.width + current.x - startPointer.x, snapStepMm);
  const nextHeight = snapMm(startFrame.height + current.y - startPointer.y, snapStepMm);

  return {
    ...startFrame,
    width: clamp(nextWidth, minSize.widthMm, PAGE_SPEC.widthMm - startFrame.x),
    height: clamp(nextHeight, minSize.heightMm, PAGE_SPEC.heightMm - startFrame.y),
  };
}

export function setBlockElementFrame(element, frame) {
  element.style.left = `${frame.x}mm`;
  element.style.top = `${frame.y}mm`;
  element.style.width = `${frame.width}mm`;
  element.style.height = `${frame.height}mm`;
}

function getBlockMoveSnapMm(block) {
  if (getCommonStyle(block).useFineSnap) return PAGE_SPEC.gridMm / 2;
  if (block.type === BLOCK_TYPES.line) return PAGE_SPEC.gridMm / 2;
  return PAGE_SPEC.gridMm;
}

function getBlockResizeSnapMm(block) {
  if (getCommonStyle(block).useFineSnap) return PAGE_SPEC.gridMm / 2;
  if (block.type === BLOCK_TYPES.line) return PAGE_SPEC.gridMm / 2;
  return PAGE_SPEC.gridMm;
}

function getBlockMinimumSize(block) {
  if (block.type === BLOCK_TYPES.line) {
    return { widthMm: 5, heightMm: 0.5 };
  }

  return { widthMm: PAGE_SPEC.gridMm, heightMm: PAGE_SPEC.gridMm };
}
