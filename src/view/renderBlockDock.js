import { listBlockDefinitions } from "../blocks/blockRegistry.js";
import { el, iconButton } from "../shared/dom.js";

export function renderBlockDock({ editorState, controller }) {
  const activeTool = editorState.activeTool;

  return el("aside", { className: "block-dock", title: "Crear bloques" }, [
    el("div", { className: "block-dock__items" }, listBlockDefinitions().map((definition) => iconButton({
      iconClass: definition.iconClass,
      label: activeTool === definition.type
        ? `Cancelar ${definition.label.toLowerCase()}`
        : `Crear ${definition.label.toLowerCase()}`,
      active: activeTool === definition.type,
      onClick: () => {
        if (activeTool === definition.type) {
          controller.cancelPendingBlockPlacement();
          return;
        }

        controller.addBlock(definition.type);
      },
    }))),
    activeTool && activeTool !== "select"
      ? el("div", { className: "block-dock__hint", textContent: "Click en una página para crear" })
      : null,
  ]);
}
