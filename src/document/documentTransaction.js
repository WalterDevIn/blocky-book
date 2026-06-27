import { saveStoredDocument } from "./documentStorage.js";

export function commitDocumentChange(editorState, mutation) {
  const result = mutation(editorState.document);
  saveStoredDocument(editorState.document);
  return result;
}
