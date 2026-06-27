import { BLOCK_TYPES } from "../blocks/blockTypes.js";
import { renderGridBlock } from "./renderGridBlock.js";
import { renderIconBlock } from "./renderIconBlock.js";
import { renderImageBlock } from "./renderImageBlock.js";
import { renderLineBlock } from "./renderLineBlock.js";
import { renderRuledTextBlock } from "./renderRuledTextBlock.js";
import { renderTextBlock } from "./renderTextBlock.js";

const BLOCK_RENDERERS = {
  [BLOCK_TYPES.text]: renderTextBlock,
  [BLOCK_TYPES.line]: renderLineBlock,
  [BLOCK_TYPES.ruledText]: renderRuledTextBlock,
  [BLOCK_TYPES.gridBlock]: renderGridBlock,
  [BLOCK_TYPES.image]: renderImageBlock,
  [BLOCK_TYPES.icon]: renderIconBlock,
};

export function getBlockRenderer(type) {
  return BLOCK_RENDERERS[type] ?? null;
}
