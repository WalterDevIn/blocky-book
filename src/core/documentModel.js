import { DEFAULT_BLOCK } from "./constants.js";
import { createId } from "./id.js";

export function createSpread() {
  return {
    id: createId(),
    pages: [createPage(), createPage()],
  };
}

export function createPage() {
  return {
    id: createId(),
    blocks: [],
  };
}

export function createTextBlock(overrides = {}) {
  return {
    id: createId(),
    ...DEFAULT_BLOCK,
    ...overrides,
  };
}
