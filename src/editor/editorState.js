import { createInitialPrintDocument } from "../document/documentFactory.js";

export function createEditorState() {
  return {
    document: createInitialPrintDocument(),
    viewport: {
      zoom: 1,
      showGrid: true,
    },
    selection: {
      blockId: null,
      pageId: null,
    },
    interaction: {
      mode: "idle",
      editingBlockId: null,
      contextMenu: null,
    },
    activeTool: "select",
  };
}
