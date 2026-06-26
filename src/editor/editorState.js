import { createPrintDocument } from "../document/documentFactory.js";

export function createEditorState() {
  return {
    document: createPrintDocument(),
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
      draggingBlockId: null,
      droppingBlockId: null,
      contextMenu: null,
    },
    activeTool: "select",
  };
}
