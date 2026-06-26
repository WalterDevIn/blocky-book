import { createSpread, createTextBlock } from "../core/documentModel.js";
import { deleteSelectedBlock, state } from "../core/state.js";
import { el, iconButton } from "./dom.js";

export function toolbarComponent({ render }) {
  const addBlockButton = iconButton({
    iconClass: "fa-solid fa-font",
    label: "Agregar bloque de texto",
    onClick: () => {
      const firstPage = state.spreads[0].pages[0];
      firstPage.blocks.push(createTextBlock());
      state.selectedId = firstPage.blocks.at(-1).id;
      state.editingId = null;
      state.contextMenu = null;
      render();
    },
  });

  const addSpreadButton = iconButton({
    iconClass: "fa-regular fa-clone",
    label: "Agregar par de hojas",
    onClick: () => {
      state.spreads.push(createSpread());
      state.contextMenu = null;
      render();
    },
  });

  const deleteButton = iconButton({
    iconClass: "fa-regular fa-trash-can",
    label: "Borrar bloque seleccionado",
    disabled: !state.selectedId,
    onClick: () => {
      deleteSelectedBlock();
      render();
    },
  });

  const gridToggle = el("button", {
    className: `icon-button${state.showGrid ? " is-active" : ""}`,
    type: "button",
    title: state.showGrid ? "Ocultar grilla" : "Mostrar grilla",
    on: {
      click: () => {
        state.showGrid = !state.showGrid;
        state.contextMenu = null;
        render();
      },
    },
  }, [
    el("i", { className: "fa-solid fa-table-cells" }),
    el("span", { className: "sr-only", textContent: "Mostrar u ocultar grilla" }),
  ]);

  const hint = el("div", {
    className: "hint",
    textContent: "Click seleccionado edita · Enter confirma · Click derecho cambia fuente",
  });

  return el("header", { className: "toolbar" }, [
    el("div", { className: "toolbar__title", textContent: "Mini RPG Printer" }),
    el("div", { className: "toolbar__group" }, [addBlockButton, addSpreadButton, deleteButton, gridToggle]),
    el("div", { className: "toolbar__spacer" }),
    hint,
  ]);
}
