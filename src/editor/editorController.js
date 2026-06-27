import { commitDocumentChange } from "../document/documentTransaction.js";
import { createBlockActions } from "./actions/blockActions.js";
import { createClipboardActions } from "./actions/clipboardActions.js";
import { createMenuActions } from "./actions/menuActions.js";
import { createPageActions } from "./actions/pageActions.js";
import { createSelectionActions } from "./actions/selectionActions.js";

export function createEditorController({ editorState, render }) {
  function mutateDocument(mutation) {
    return commitDocumentChange(editorState, mutation);
  }

  const sharedContext = {
    editorState,
    render,
    mutateDocument,
  };
  const blockActions = createBlockActions(sharedContext);
  const selectionActions = createSelectionActions({
    editorState,
    render,
    commitTextEdit: blockActions.commitTextEdit,
  });
  const clipboardActions = createClipboardActions(sharedContext);
  const pageActions = createPageActions(sharedContext);
  const menuActions = createMenuActions({
    editorState,
    render,
    commitTextEdit: blockActions.commitTextEdit,
  });

  return {
    ...blockActions,
    ...selectionActions,
    ...clipboardActions,
    ...pageActions,
    ...menuActions,
  };
}
