import { el } from "../shared/dom.js";
import { buttonGroup, colorOpacityControl, textControl, toggleButton } from "./propertyControls.js";

export function renderGlobalColorsPanel({ editorState, controller }) {
  return el("details", { className: "global-colors-panel toolbar__global-colors" }, [
    el("summary", { className: "global-colors-panel__summary", title: "Colores globales" }, [
      el("i", { className: "fa-solid fa-palette", attrs: { "aria-hidden": "true" } }),
      el("span", { textContent: "Colores" }),
    ]),
    el("div", { className: "global-colors-panel__body" }, [
      el("div", { className: "global-colors-panel__header" }, [
        el("strong", { textContent: "Colores globales" }),
        toggleButton({
          label: "+ Color",
          title: "Crear color global",
          active: false,
          onClick: () => controller.addGlobalColor(),
        }),
      ]),
      editorState.globalColors.length === 0
        ? el("p", { className: "global-colors-panel__empty", textContent: "No hay colores globales." })
        : editorState.globalColors.map((color) => renderGlobalColorRow({ color, controller })),
    ]),
  ]);
}

function renderGlobalColorRow({ color, controller }) {
  return el("div", { className: "global-color-row" }, [
    el("div", { className: "global-color-row__preview", style: { backgroundColor: colorWithOpacity(color.hex, color.opacity) } }),
    el("div", { className: "global-color-row__fields" }, [
      textControl({
        value: color.name,
        placeholder: "Nombre",
        onChange: (value) => controller.updateGlobalColor(color.id, { name: value }),
      }),
      textControl({
        value: color.hex,
        placeholder: "#2563eb",
        onChange: (value) => controller.updateGlobalColor(color.id, { hex: value }),
      }),
      colorOpacityControl({
        color: color.hex,
        opacity: color.opacity,
        onColorChange: (value) => controller.updateGlobalColor(color.id, { hex: value }),
        onOpacityChange: (value) => controller.updateGlobalColor(color.id, { opacity: value }),
      }),
      buttonGroup([
        toggleButton({
          label: "Borrar",
          title: "Eliminar color global",
          active: false,
          onClick: () => controller.deleteGlobalColor(color.id),
        }),
      ]),
    ]),
  ]);
}

function colorWithOpacity(hex, opacity) {
  const color = hexToRgb(hex);
  return `rgba(${color.r}, ${color.g}, ${color.b}, ${opacity})`;
}

function hexToRgb(hex) {
  const normalized = String(hex ?? "").replace("#", "");
  const value = Number.parseInt(normalized.length === 3
    ? normalized.split("").map((char) => `${char}${char}`).join("")
    : normalized, 16);

  if (Number.isNaN(value)) return { r: 31, g: 35, b: 40 };

  return {
    r: (value >> 16) & 255,
    g: (value >> 8) & 255,
    b: value & 255,
  };
}
