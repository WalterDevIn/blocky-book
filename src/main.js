import "./styles.css";

const PAGE_WIDTH_MM = 85;
const PAGE_HEIGHT_MM = 147.5;
const GRID_MM = 5;
const DEFAULT_BLOCK = {
  text: "Texto",
  x: 10,
  y: 10,
  width: 30,
  height: 15,
  fontFamily: "Arial",
};

const state = {
  showGrid: true,
  selectedId: null,
  editingId: null,
  spreads: [createSpread()],
};

function createSpread() {
  return {
    id: crypto.randomUUID(),
    pages: [createPage(), createPage()],
  };
}

function createPage() {
  return {
    id: crypto.randomUUID(),
    blocks: [],
  };
}

function createBlock(overrides = {}) {
  return {
    id: crypto.randomUUID(),
    ...DEFAULT_BLOCK,
    ...overrides,
  };
}

function snap(value) {
  return Math.round(value / GRID_MM) * GRID_MM;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function getSelectedBlock() {
  for (const spread of state.spreads) {
    for (const page of spread.pages) {
      const block = page.blocks.find((item) => item.id === state.selectedId);
      if (block) return { block, page };
    }
  }
  return null;
}

function getPageById(pageId) {
  for (const spread of state.spreads) {
    const page = spread.pages.find((item) => item.id === pageId);
    if (page) return page;
  }
  return null;
}

function mmFromPointer(event, pageElement) {
  const rect = pageElement.getBoundingClientRect();
  const mmPerPxX = PAGE_WIDTH_MM / rect.width;
  const mmPerPxY = PAGE_HEIGHT_MM / rect.height;

  return {
    x: (event.clientX - rect.left) * mmPerPxX,
    y: (event.clientY - rect.top) * mmPerPxY,
  };
}

function setSelected(blockId) {
  state.selectedId = blockId;
  state.editingId = null;
  render();
}

function addTextBlock() {
  const firstPage = state.spreads[0].pages[0];
  firstPage.blocks.push(createBlock());
  state.selectedId = firstPage.blocks.at(-1).id;
  render();
}

function addSpread() {
  state.spreads.push(createSpread());
  render();
}

function deleteSelectedBlock() {
  if (!state.selectedId) return;

  for (const spread of state.spreads) {
    for (const page of spread.pages) {
      const index = page.blocks.findIndex((block) => block.id === state.selectedId);
      if (index !== -1) {
        page.blocks.splice(index, 1);
        state.selectedId = null;
        state.editingId = null;
        render();
        return;
      }
    }
  }
}

function updateSelectedFont(fontFamily) {
  const selected = getSelectedBlock();
  if (!selected) return;

  selected.block.fontFamily = fontFamily;
  render();
}

function startDragging(event, block, pageElement) {
  if (state.editingId === block.id) return;

  const startPointer = mmFromPointer(event, pageElement);
  const startX = block.x;
  const startY = block.y;

  pageElement.setPointerCapture(event.pointerId);

  const move = (moveEvent) => {
    const current = mmFromPointer(moveEvent, pageElement);
    const nextX = snap(startX + current.x - startPointer.x);
    const nextY = snap(startY + current.y - startPointer.y);

    block.x = clamp(nextX, 0, PAGE_WIDTH_MM - block.width);
    block.y = clamp(nextY, 0, PAGE_HEIGHT_MM - block.height);
    render();
  };

  const up = (upEvent) => {
    pageElement.releasePointerCapture(upEvent.pointerId);
    window.removeEventListener("pointermove", move);
    window.removeEventListener("pointerup", up);
  };

  window.addEventListener("pointermove", move);
  window.addEventListener("pointerup", up);
}

function startResizing(event, block, pageElement) {
  event.stopPropagation();

  const startPointer = mmFromPointer(event, pageElement);
  const startWidth = block.width;
  const startHeight = block.height;

  pageElement.setPointerCapture(event.pointerId);

  const move = (moveEvent) => {
    const current = mmFromPointer(moveEvent, pageElement);
    const nextWidth = snap(startWidth + current.x - startPointer.x);
    const nextHeight = snap(startHeight + current.y - startPointer.y);

    block.width = clamp(nextWidth, GRID_MM, PAGE_WIDTH_MM - block.x);
    block.height = clamp(nextHeight, GRID_MM, PAGE_HEIGHT_MM - block.y);
    render();
  };

  const up = (upEvent) => {
    pageElement.releasePointerCapture(upEvent.pointerId);
    window.removeEventListener("pointermove", move);
    window.removeEventListener("pointerup", up);
  };

  window.addEventListener("pointermove", move);
  window.addEventListener("pointerup", up);
}

function startEditing(blockId) {
  state.selectedId = blockId;
  state.editingId = blockId;
  render();

  requestAnimationFrame(() => {
    const editable = document.querySelector(`[data-editable-id="${blockId}"]`);
    if (!editable) return;

    editable.focus();
    document.getSelection()?.selectAllChildren(editable);
  });
}

function finishEditing(block, editableElement) {
  block.text = editableElement.innerText.trim() || "Texto";
  state.editingId = null;
  render();
}

function pageComponent(page, pageNumber) {
  const pageElement = document.createElement("section");
  pageElement.className = `page${state.showGrid ? " is-grid-visible" : ""}`;
  pageElement.dataset.pageId = page.id;

  pageElement.addEventListener("pointerdown", (event) => {
    if (event.target !== pageElement) return;
    state.selectedId = null;
    state.editingId = null;
    render();
  });

  page.blocks.forEach((block) => {
    pageElement.appendChild(textBlockComponent(block, pageElement));
  });

  const label = document.createElement("div");
  label.className = "page__label";
  label.textContent = `Hoja ${pageNumber}`;
  pageElement.appendChild(label);

  return pageElement;
}

function textBlockComponent(block, pageElement) {
  const blockElement = document.createElement("article");
  blockElement.className = `text-block${state.selectedId === block.id ? " is-selected" : ""}${state.editingId === block.id ? " is-editing" : ""}`;
  blockElement.style.left = `${block.x}mm`;
  blockElement.style.top = `${block.y}mm`;
  blockElement.style.width = `${block.width}mm`;
  blockElement.style.height = `${block.height}mm`;
  blockElement.style.fontFamily = block.fontFamily;

  blockElement.addEventListener("pointerdown", (event) => {
    event.stopPropagation();
    state.selectedId = block.id;
    if (state.editingId !== block.id) render();
    startDragging(event, block, pageElement);
  });

  blockElement.addEventListener("dblclick", (event) => {
    event.stopPropagation();
    startEditing(block.id);
  });

  const content = document.createElement("div");
  content.className = "text-block__content";
  content.dataset.editableId = block.id;
  content.textContent = block.text;
  content.contentEditable = state.editingId === block.id ? "true" : "false";

  content.addEventListener("blur", () => finishEditing(block, content));
  content.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      state.editingId = null;
      render();
    }

    if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
      finishEditing(block, content);
    }
  });

  blockElement.appendChild(content);

  if (state.selectedId === block.id && state.editingId !== block.id) {
    const resizeHandle = document.createElement("button");
    resizeHandle.className = "resize-handle";
    resizeHandle.type = "button";
    resizeHandle.title = "Redimensionar";
    resizeHandle.addEventListener("pointerdown", (event) => startResizing(event, block, pageElement));
    blockElement.appendChild(resizeHandle);
  }

  return blockElement;
}

function toolbarComponent() {
  const toolbar = document.createElement("header");
  toolbar.className = "toolbar";

  const title = document.createElement("div");
  title.className = "toolbar__title";
  title.textContent = "Mini RPG Printer";

  const addBlockButton = document.createElement("button");
  addBlockButton.type = "button";
  addBlockButton.textContent = "Agregar bloque de texto";
  addBlockButton.addEventListener("click", addTextBlock);

  const addSpreadButton = document.createElement("button");
  addSpreadButton.type = "button";
  addSpreadButton.textContent = "Agregar par de hojas";
  addSpreadButton.addEventListener("click", addSpread);

  const deleteButton = document.createElement("button");
  deleteButton.type = "button";
  deleteButton.textContent = "Borrar bloque";
  deleteButton.disabled = !state.selectedId;
  deleteButton.addEventListener("click", deleteSelectedBlock);

  const fontSelect = document.createElement("select");
  ["Arial", "Georgia", "Times New Roman", "Courier New", "Verdana", "Trebuchet MS"].forEach((font) => {
    const option = document.createElement("option");
    option.value = font;
    option.textContent = font;
    fontSelect.appendChild(option);
  });
  const selected = getSelectedBlock();
  fontSelect.value = selected?.block.fontFamily ?? "Arial";
  fontSelect.disabled = !selected;
  fontSelect.addEventListener("change", () => updateSelectedFont(fontSelect.value));

  const gridLabel = document.createElement("label");
  const gridInput = document.createElement("input");
  gridInput.type = "checkbox";
  gridInput.checked = state.showGrid;
  gridInput.addEventListener("change", () => {
    state.showGrid = gridInput.checked;
    render();
  });
  gridLabel.append(gridInput, "Mostrar grilla");

  const hint = document.createElement("div");
  hint.className = "hint";
  hint.textContent = "Doble click edita · Delete/Supr borra · Todo encaja cada 5 mm";

  const spacer = document.createElement("div");
  spacer.className = "toolbar__spacer";

  toolbar.append(title, addBlockButton, addSpreadButton, deleteButton, fontSelect, gridLabel, spacer, hint);
  return toolbar;
}

function spreadsComponent() {
  const viewport = document.createElement("main");
  viewport.className = "editor-viewport";

  const spreads = document.createElement("div");
  spreads.className = "spreads";

  let pageNumber = 1;
  state.spreads.forEach((spread) => {
    const spreadElement = document.createElement("div");
    spreadElement.className = "spread";

    spread.pages.forEach((page) => {
      spreadElement.appendChild(pageComponent(page, pageNumber));
      pageNumber += 1;
    });

    spreads.appendChild(spreadElement);
  });

  viewport.appendChild(spreads);
  return viewport;
}

function render() {
  const app = document.querySelector("#app");
  app.innerHTML = "";

  const shell = document.createElement("div");
  shell.className = "app-shell";
  shell.append(toolbarComponent(), spreadsComponent());

  app.appendChild(shell);
}

window.addEventListener("keydown", (event) => {
  const isEditingText = state.editingId !== null;
  if (isEditingText) return;

  if (event.key === "Delete" || event.key === "Backspace") {
    deleteSelectedBlock();
  }
});

render();
