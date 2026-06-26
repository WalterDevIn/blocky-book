import { el } from "../shared/dom.js";

function stopEditorShortcut(event) {
  event.stopPropagation();
}

export function field(label, control) {
  return el("label", { className: "property-field" }, [
    el("span", { className: "property-field__label", textContent: label }),
    control,
  ]);
}

export function selectControl({ value, options, onChange }) {
  const select = el("select", {
    className: "property-control",
    on: {
      keydown: stopEditorShortcut,
      change: (event) => onChange(event.target.value),
    },
  }, options.map((option) => el("option", {
    value: option.value,
    textContent: option.label,
  })));

  select.value = value;
  return select;
}

export function numberControl({ value, min, max, step = 1, onChange }) {
  return el("input", {
    className: "property-control",
    type: "number",
    value: String(value),
    attrs: {
      min: String(min),
      max: String(max),
      step: String(step),
    },
    on: {
      keydown: stopEditorShortcut,
      change: (event) => onChange(Number(event.target.value)),
    },
  });
}

export function colorControl({ value, onChange }) {
  return el("input", {
    className: "property-control property-control--color",
    type: "color",
    value,
    on: {
      keydown: stopEditorShortcut,
      change: (event) => onChange(event.target.value),
    },
  });
}

export function checkboxControl({ checked, onChange }) {
  return el("input", {
    className: "property-control property-control--checkbox",
    type: "checkbox",
    checked,
    on: {
      keydown: stopEditorShortcut,
      change: (event) => onChange(event.target.checked),
    },
  });
}

export function toggleButton({ label, active, title, onClick }) {
  return el("button", {
    className: `property-toggle${active ? " is-active" : ""}`,
    type: "button",
    title,
    textContent: label,
    on: {
      keydown: stopEditorShortcut,
      click: onClick,
    },
  });
}

export function buttonGroup(children) {
  return el("div", { className: "property-button-group" }, children);
}

export function section(title, children) {
  return el("section", { className: "property-section" }, [
    el("div", { className: "property-section__title", textContent: title }),
    ...children,
  ]);
}
