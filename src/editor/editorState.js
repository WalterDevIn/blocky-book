import { createPrintDocument } from "../document/documentFactory.js";
import { loadEditorSettings } from "../settings/editorSettingsStorage.js";

export function createEditorState() {
  const settings = loadEditorSettings();

  return {
    document: createPrintDocument({ pageSpec: settings.pageSpec }),
    settings,
    viewport: {
      zoom: 1,
      showGrid: true,
      showPageMargin: false,
    },
    selection: {
      blockId: null,
      pageId: null,
    },
    interaction: {
      mode: "idle",
      editingBlockId: null,
      pickingBlockId: null,
      draggingBlockId: null,
      droppingBlockId: null,
      contextMenu: null,
    },
    activeTool: "select",
  };
}
