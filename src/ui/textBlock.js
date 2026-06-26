import { PAGE_HEIGHT_MM, PAGE_WIDTH_MM } from "../core/constants.js";
import { clamp, mmFromPointer, safeReleasePointerCapture, snap } from "../core/geometry.js";
import { finishCurrentEdit, state } from "../core/state.js";
import { el } from "./dom.js";
import { openFontContextMenu } from "./contextMenu.js";

const CLICK_MOVE_THRESHOLD_PX = 4;

function readEditedText(blockId) {
  return document.querySelector(`[data-editable-id="${blockId}"]`)?.innerText;
}

function focusEditable(blockId) {
  requestAnimationFrame(() => {
    const editable = document.querySelector(`[data-editable-id="${blockId}"]`);
    if (!editable) return;

    editable.focus();
    const range = document.createRange();
    range.selectNodeContents(editable);
    range.collapse(false);

    const selection = document.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  });
}

function enterEditMode(blockId, render) {
  state.selectedId = blockId;
  state.editingId = blockId;
  state.contextMenu = null;
  render();
  focusEditable(blockId);
}

function startResizing(event, block, pageElement, render) {
  event.stopPropagation();

  const startPointer = mmFromPointer(event, pageElement);
  const startWidth = block.width;
  const startHeight = block.height;

  pageElement.setPointerCapture?.(event.pointerId);

  const move = (moveEvent) => {
    const current = mmFromPointer(moveEvent, pageElement);
    const nextWidth = snap(startWidth + current.x - startPointer.x);
    const nextHeight = snap(startHeight + current.y - startPointer.y);

    block.width = clamp(nextWidth, 5, PAGE_WIDTH_MM - block.x);
    block.height = clamp(nextHeight, 5, PAGE_HEIGHT_MM - block.y);
    render();
  };

  const up = (upEvent) => {
    safeReleasePointerCapture(pageElement, upEvent.pointerId);
    window.removeEventListener("pointermove", move);
    window.removeEventListener("pointerup", up);
  };

  window.addEventListener("pointermove", move);
  window.addEventListener("pointerup", up);
}

function startMoveOrEdit(event, block, pageElement, render) {
  event.stopPropagation();

  const wasSelected = state.selectedId === block.id;
  const startedEditing = state.editingId === block.id;
  const startPointer = mmFromPointer(event, pageElement);
  const startClient = { x: event.clientX, y: event.clientY };
  const startBlock = { x: block.x, y: block.y };
  let moved = false;

  finishCurrentEdit(readEditedText);
  state.selectedId = block.id;
  state.contextMenu = null;

  pageElement.setPointerCapture?.(event.pointerId);

  if (!wasSelected || startedEditing) {
    render();
  }

  const move = (moveEvent) => {
    const dxPx = Math.abs(moveEvent.clientX - startClient.x);
    const dyPx = Math.abs(moveEvent.clientY - startClient.y);

    if (dxPx > CLICK_MOVE_THRESHOLD_PX || dyPx > CLICK_MOVE_THRESHOLD_PX) {
      moved = true;
    }

    if (!moved || startedEditing) return;

    const current = mmFromPointer(moveEvent, pageElement);
    const nextX = snap(startBlock.x + current.x - startPointer.x);
    const nextY = snap(startBlock.y + current.y - startPointer.y);

    block.x = clamp(nextX, 0, PAGE_WIDTH_MM - block.width);
    block.y = clamp(nextY, 0, PAGE_HEIGHT_MM - block.height);
    render();
  };

  const up = (upEvent) => {
    safeReleasePointerCapture(pageElement, upEvent.pointerId);
    window.removeEventListener("pointermove", move);
    window.removeEventListener("pointerup", up);

    if (startedEditing) return;

    if (wasSelected && !moved) {
      enterEditMode(block.id, render);
      return;
    }

    render();
  };

  window.addEventListener("pointermove", move);
  window.addEventListener("pointerup", up);
}

export function textBlockComponent(block, pageElement, { render }) {
  const isSelected = state.selectedId === block.id;
  const isEditing = state.editingId === block.id;

  const blockElement = el("article", {
    className: `text-block${isSelected ? " is-selected" : ""}${isEditing ? " is-editing" : ""}`,
    style: {
      left: `${block.x}mm`,
      top: `${block.y}mm`,
      width: `${block.width}mm`,
      height: `${block.height}mm`,
      fontFamily: block.fontFamily,
    },
    on: {
      pointerdown: (event) => startMoveOrEdit(event, block, pageElement, render),
      contextmenu: (event) => {
        event.preventDefault();
        event.stopPropagation();
        finishCurrentEdit(readEditedText);
        openFontContextMenu({ blockId: block.id, clientX: event.clientX, clientY: event.clientY });
        render();
      },
    },
  });

  const content = el("div", {
    className: "text-block__content",
    textContent: block.text,
    dataset: { editableId: block.id },
    on: {
      keydown: (event) => {
        if (!isEditing) return;

        if (event.key === "Enter" && !event.shiftKey) {
          event.preventDefault();
          finishCurrentEdit(readEditedText);
          render();
        }

        if (event.key === "Escape") {
          event.preventDefault();
          state.editingId = null;
          render();
        }
      },
    },
  });
  content.contentEditable = isEditing ? "true" : "false";

  blockElement.appendChild(content);

  if (isSelected && !isEditing) {
    blockElement.appendChild(el("button", {
      className: "resize-handle",
      type: "button",
      title: "Redimensionar",
      on: {
        pointerdown: (event) => startResizing(event, block, pageElement, render),
      },
    }));
  }

  return blockElement;
}
