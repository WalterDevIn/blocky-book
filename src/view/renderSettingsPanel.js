import { el } from "../shared/dom.js";
import { numberControl } from "./propertyControls.js";

export function renderSettingsPanel({ editorState, controller }) {
  const pageSpec = editorState.document.pageSpec;

  return el("div", { className: "settings-panel", title: "Configuración" }, [
    el("span", { className: "settings-panel__title", textContent: "Configuración" }),
    el("label", { className: "settings-panel__field" }, [
      el("span", { textContent: "Ancho" }),
      numberControl({
        value: pageSpec.widthMm,
        min: 30,
        max: 500,
        step: 0.5,
        onChange: (value) => controller.updatePageSize({ widthMm: value }),
      }),
    ]),
    el("label", { className: "settings-panel__field" }, [
      el("span", { textContent: "Alto" }),
      numberControl({
        value: pageSpec.heightMm,
        min: 30,
        max: 700,
        step: 0.5,
        onChange: (value) => controller.updatePageSize({ heightMm: value }),
      }),
    ]),
    el("span", { className: "settings-panel__unit", textContent: "mm" }),
  ]);
}
