export function el(tagName, options = {}, children = []) {
  const element = document.createElement(tagName);

  if (options.className) element.className = options.className;
  if (options.textContent !== undefined) element.textContent = options.textContent;
  if (options.innerHTML !== undefined) element.innerHTML = options.innerHTML;
  if (options.title) element.title = options.title;
  if (options.type) element.type = options.type;
  if (options.disabled !== undefined) element.disabled = options.disabled;
  if (options.value !== undefined) element.value = options.value;
  if (options.checked !== undefined) element.checked = options.checked;

  Object.entries(options.dataset ?? {}).forEach(([key, value]) => {
    element.dataset[key] = value;
  });

  Object.entries(options.style ?? {}).forEach(([key, value]) => {
    element.style[key] = value;
  });

  Object.entries(options.attrs ?? {}).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });

  Object.entries(options.on ?? {}).forEach(([eventName, handler]) => {
    element.addEventListener(eventName, handler);
  });

  children.forEach((child) => {
    if (child === null || child === undefined) return;
    element.append(child);
  });

  return element;
}

export function icon(className) {
  return el("i", { className, attrs: { "aria-hidden": "true" } });
}

export function iconButton({ iconClass, label, disabled = false, active = false, onClick }) {
  return el(
    "button",
    {
      className: `icon-button${active ? " is-active" : ""}`,
      type: "button",
      title: label,
      disabled,
      on: { click: onClick },
    },
    [icon(iconClass), el("span", { className: "sr-only", textContent: label })],
  );
}
