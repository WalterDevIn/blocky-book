import { BLOCK_TYPES } from "./blockTypes.js";

const DEFAULT_MINIMUM_FRAME_SIZE = {};

const MINIMUM_FRAME_SIZE_BY_TYPE = {
  [BLOCK_TYPES.line]: { widthMm: 5, heightMm: 0.5 },
};

export function getMinimumFrameSize(block) {
  return MINIMUM_FRAME_SIZE_BY_TYPE[block.type] ?? DEFAULT_MINIMUM_FRAME_SIZE;
}
