import { addSpread as addSpreadToDocument } from "../../document/documentCommands.js";
import { updateEditorSettings } from "../../settings/editorSettingsStorage.js";

export function createPageActions({ editorState, render, mutateDocument }) {
  return {
    addSpread() {
      mutateDocument((documentModel) => addSpreadToDocument(documentModel));
      editorState.interaction.contextMenu = null;
      render();
    },

    updatePageSize(patch) {
      const nextSettings = updateEditorSettings({ pageSpec: patch });
      editorState.settings = nextSettings;
      mutateDocument((documentModel) => {
        documentModel.pageSpec = nextSettings.pageSpec;
        documentModel.intent = {
          ...documentModel.intent,
          snapUnitMm: nextSettings.pageSpec.gridMm,
        };
        return documentModel;
      });
      render();
    },

    toggleGrid() {
      editorState.viewport.showGrid = !editorState.viewport.showGrid;
      render();
    },

    togglePageMargin() {
      editorState.viewport.showPageMargin = !editorState.viewport.showPageMargin;
      render();
    },
  };
}
