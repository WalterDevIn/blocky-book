import { listBlockDefinitions } from "../blocks/blockRegistry.js";
import { hasSelection } from "../editor/editorSelectors.js";
import { el, iconButton } from "../shared/dom.js";
import { renderGlobalColorsPanel } from "./renderGlobalColorsPanel.js";
import { renderSettingsPanel } from "./renderSettingsPanel.js";

export function renderToolbar({ editorState, controller }) {
  return el("header", { className: "toolbar" }, [
    el("div", { className: "toolbar__title", textContent: "Mini RPG Printer" }),
    el("div", { className: "toolbar__group", title: "Agregar bloques" }, renderBlockButtons({ controller })),
    el("div", { className: "toolbar__group", title: "Página y visualización" }, [
      iconButton({
        iconClass: "fa-regular fa-clone",
        label: "Agregar par de hojas",
        onClick: () => controller.addSpread(),
      }),
      iconButton({
        iconClass: "fa-solid fa-table-cells",
        label: editorState.viewport.showGrid ? "Ocultar grilla" : "Mostrar grilla",
        active: editorState.viewport.showGrid,
        onClick: () => controller.toggleGrid(),
      }),
      iconButton({
        iconClass: "fa-solid fa-book-open",
        label: editorState.viewport.showPageMargin ? "Ocultar margen de anillos" : "Mostrar margen de anillos",
        active: editorState.viewport.showPageMargin,
        onClick: () => controller.togglePageMargin(),
      }),
    ]),
    el("div", { className: "toolbar__group", title: "Selección" }, [
      iconButton({
        iconClass: "fa-regular fa-trash-can",
        label: "Borrar bloque seleccionado",
        disabled: !hasSelection(editorState),
        onClick: () => controller.deleteSelectedBlock(),
      }),
    ]),
    renderGlobalColorsPanel({ editorState, controller }),
    renderSettingsPanel({ editorState, controller }),
    el("div", { className: "toolbar__spacer" }),
    el("div", {
      className: "hint",
      textContent: "Documento imprimible · Bloques en mm · Click derecho abre propiedades",
    }),
  ]);
}

function renderBlockButtons({ controller }) {
  return listBlockDefinitions().map((definition) => iconButton({
    iconClass: definition.iconClass,
    label: `Agregar ${definition.label.toLowerCase()}`,
    onClick: () => controller.addBlock(definition.type),
  }));
}
