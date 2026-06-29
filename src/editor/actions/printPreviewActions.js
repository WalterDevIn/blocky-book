export function createPrintPreviewActions({ editorState, render }) {
  return {
    openPrintPreview() {
      editorState.ui = {
        ...editorState.ui,
        printPreviewOpen: true,
      };
      editorState.interaction.contextMenu = null;
      editorState.interaction.editingBlockId = null;
      render();
    },

    closePrintPreview() {
      editorState.ui = {
        ...editorState.ui,
        printPreviewOpen: false,
      };
      render();
    },
  };
}
