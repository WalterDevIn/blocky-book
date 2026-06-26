import { hydratePrintDocument } from "../document/documentHydration.js";
import { loadStoredDocument } from "../document/documentStorage.js";
import { loadEditorSettings } from "../settings/editorSettingsStorage.js";

export function createEditorState() {
  const settings = loadEditorSettings();

  return {
    document: hydratePrintDocument(loadStoredDocument(), { pageSpec: settings.pageSpec }),
    settings,
    clipboard: {
      block: null,
    },
    viewport: {
      zoom: 1,
      showGrid: true,
      showPageMargin: false,
    },
    selection: {
      blockId: null,
      blockIds: [],
      pageId: null,
    },
    interaction: {
      mode: "idle",
      editingBlockId: null,
      pickingBlockId: null,
      draggingBlockId: null,
      droppingBlockId: null,
      contextMenu: null,
      marquee: null,
    },
    activeTool: "select",
  };
}
