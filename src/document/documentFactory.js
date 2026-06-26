import { getBlockDefinition } from "../blocks/blockRegistry.js";
import { createId } from "../shared/createId.js";
import { PAGE_SPEC, PRINT_DOCUMENT_VERSION, PRINT_INTENT } from "./printSpec.js";

export function createPage() {
  return {
    id: createId("page"),
    blocks: [],
  };
}

export function createSpread() {
  const pages = [createPage(), createPage()];

  return {
    id: createId("spread"),
    pageIds: pages.map((page) => page.id),
    pages,
  };
}

export function createBlock(type, overrides = {}) {
  const definition = getBlockDefinition(type);

  return {
    id: createId("block"),
    type,
    frame: {
      ...definition.defaultFrame,
      ...overrides.frame,
    },
    props: structuredClone({
      ...definition.defaultProps,
      ...overrides.props,
    }),
  };
}

export function createPrintDocument({ pageSpec = PAGE_SPEC } = {}) {
  return {
    version: PRINT_DOCUMENT_VERSION,
    intent: {
      ...PRINT_INTENT,
      snapUnitMm: pageSpec.gridMm,
    },
    pageSpec,
    spreads: [createSpread()],
  };
}
