import { GRID_BLOCK_DEFINITION } from "./gridBlockDefinition.js";
import { ICON_BLOCK_DEFINITION } from "./iconBlockDefinition.js";
import { IMAGE_BLOCK_DEFINITION } from "./imageBlockDefinition.js";
import { LINE_BLOCK_DEFINITION } from "./lineBlockDefinition.js";
import { RULED_TEXT_BLOCK_DEFINITION } from "./ruledTextBlockDefinition.js";
import { BLOCK_TYPES } from "./blockTypes.js";
import { TEXT_BLOCK_DEFINITION } from "./textBlockDefinition.js";

const BLOCK_CAPABILITIES = {
  [BLOCK_TYPES.text]: { canEditText: true },
  [BLOCK_TYPES.line]: { canEditText: false },
  [BLOCK_TYPES.ruledText]: { canEditText: true },
  [BLOCK_TYPES.gridBlock]: { canEditText: true },
  [BLOCK_TYPES.image]: { canEditText: false },
  [BLOCK_TYPES.icon]: { canEditText: false },
};

const BLOCK_CONSTRAINTS = {
  [BLOCK_TYPES.line]: {
    minFrame: { widthMm: 5, heightMm: 0.5 },
  },
};

const BASE_BLOCK_DEFINITIONS = {
  [BLOCK_TYPES.text]: TEXT_BLOCK_DEFINITION,
  [BLOCK_TYPES.line]: LINE_BLOCK_DEFINITION,
  [BLOCK_TYPES.ruledText]: RULED_TEXT_BLOCK_DEFINITION,
  [BLOCK_TYPES.gridBlock]: GRID_BLOCK_DEFINITION,
  [BLOCK_TYPES.image]: IMAGE_BLOCK_DEFINITION,
  [BLOCK_TYPES.icon]: ICON_BLOCK_DEFINITION,
};

const BLOCK_DEFINITIONS = Object.fromEntries(
  Object.entries(BASE_BLOCK_DEFINITIONS).map(([type, definition]) => [
    type,
    {
      ...definition,
      capabilities: BLOCK_CAPABILITIES[type] ?? {},
      constraints: BLOCK_CONSTRAINTS[type] ?? {},
    },
  ]),
);

export function getBlockDefinition(type) {
  const definition = BLOCK_DEFINITIONS[type];

  if (!definition) {
    throw new Error(`Unknown block type: ${type}`);
  }

  return definition;
}

export function listBlockDefinitions() {
  return Object.values(BLOCK_DEFINITIONS);
}
