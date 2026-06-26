import { createEditorController } from "../editor/editorController.js";
import { createEditorState } from "../editor/editorState.js";
import { installEditorEvents } from "../editor/installEditorEvents.js";
import { renderEditor, renderEditorError } from "../view/renderEditor.js";

export function createEditorApp({ rootElement }) {
  const editorState = createEditorState();
  let controller = null;

  function render() {
    rootElement.innerHTML = "";
    rootElement.appendChild(renderEditor({ editorState, controller }));
  }

  controller = createEditorController({ editorState, render });

  function start() {
    try {
      installEditorEvents({ editorState, controller });
      render();
    } catch (error) {
      console.error(error);
      rootElement.innerHTML = "";
      rootElement.appendChild(renderEditorError(error));
    }
  }

  return {
    editorState,
    controller,
    start,
  };
}
