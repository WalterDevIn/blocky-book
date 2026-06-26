import { el } from "../shared/dom.js";

export function field(label, control) {
  return el("label", { className: "property-field" }, [
    el("span", { className: "property-field__label", textContent: label }),
    control,
  ]);
}

export function selectControl({ value, options, onChange }) {
  return el("select", {
    className: "property-control",
    value,
    on: { change: (event) => onChange(event.target.value) },
  }, options.map((option) => el("option", {
    value: option.value,
    textContent: option.label,
  })));
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
      input: (event) => onChange(event.target.value),
    },
  });
}

export function checkboxControl({ checked, onChange }) {
  return el("input", {
    className: "property-control property-control--checkbox",
    type: "checkbox",
    checked,
    on: {
      change: (event) => onChange(event.target.checked),
    },
  });
}

export function toggleButton({ label, active, onClick }) {
  return el("button", {
    className: `property-toggle${active ? " is-active" : ""}`,
    type: "button",
    textContent: label,
    on: { click: onClick },
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
