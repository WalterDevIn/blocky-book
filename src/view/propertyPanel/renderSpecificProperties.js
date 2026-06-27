import { BLOCK_TYPES } from "../../blocks/blockTypes.js";
import { renderGridSection } from "./sections/gridSection.js";
import { renderIconSection } from "./sections/iconSection.js";
import { renderImageSection } from "./sections/imageSection.js";
import { renderLabeledSection } from "./sections/labeledSection.js";
import { renderLineSection } from "./sections/lineSection.js";
import { renderRuledTextSection } from "./sections/ruledTextSection.js";
import { renderTextSection } from "./sections/textSection.js";

export function renderSpecificProperties({ block, controller }) {
  if (block.type === BLOCK_TYPES.text) return renderTextSection({ block, controller });
  if (block.type === BLOCK_TYPES.line) return renderLineSection({ block, controller });
  if (block.type === BLOCK_TYPES.ruledText) return renderRuledTextSection({ block, controller });
  if (block.type === BLOCK_TYPES.gridBlock) {
    return [renderRuledTextSection({ block, controller }), renderGridSection({ block, controller })];
  }
  if (block.type === BLOCK_TYPES.image) return renderImageSection({ block, controller });
  if (block.type === BLOCK_TYPES.icon) return renderIconSection({ block, controller });
  if (block.type === BLOCK_TYPES.labeled) {
    return [renderTextSection({ block, controller }), renderLabeledSection({ block, controller })];
  }
  return null;
}
