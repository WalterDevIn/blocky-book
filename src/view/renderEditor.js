import { el } from "../shared/dom.js";
import { renderBlockDock } from "./renderBlockDock.js";
import { renderCanvas } from "./renderCanvas.js";
import { renderContextMenu } from "./renderContextMenu.js";
import { renderPageTreeSidebar } from "./renderPageTreeSidebar.js";
import { renderToolbar } from "./renderToolbar.js";

export function renderEditor({ editorState, controller }) {
  return el("div", { className: "app-shell" }, [
    renderToolbar({ editorState, controller }),
    el("div", { className: "editor-layout" }, [
      renderPageTreeSidebar({ editorState, controller }),
      renderCanvas({ editorState, controller }),
    ]),
    renderBlockDock({ editorState, controller }),
    renderContextMenu({ editorState, controller }),
  ]);
}

export function renderEditorError(error) {
  return el("main", { className: "boot-error" }, [
    el("h1", { textContent: "No se pudo iniciar el editor" }),
    el("p", { textContent: "Hay un error de JavaScript. Abrí la consola del navegador para ver el detalle." }),
    el("pre", { textContent: String(error?.stack || error) }),
  ]);
}
