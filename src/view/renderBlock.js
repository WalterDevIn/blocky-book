import { BLOCK_TYPES } from "../blocks/blockTypes.js";
import { handleBlockPointerDown, handleResizePointerDown } from "../editor/blockInteraction.js";
import { isEditingBlock } from "../editor/editorSelectors.js";
import { readEditedText } from "../editor/textEditing.js";
import { el } from "../shared/dom.js";
import { frameToCss } from "../shared/geometry.js";

function renderTextBlock({ block, page, pageElement, editorState, controller }) {
  const isSelected = editorState.selection.blockId === block.id;
  const isEditing = isEditingBlock(editorState, block.id);

  const blockElement = el("article", {
    className: `block block--text${isSelected ? " is-selected" : ""}${isEditing ? " is-editing" : ""}`,
    style: {
      ...frameToCss(block.frame),
      fontFamily: block.props.fontFamily,
      fontSize: `${block.props.fontSizePt}pt`,
      textAlign: block.props.textAlign,
    },
    on: {
      pointerdown: (event) => {
        if (isEditing) return;
        handleBlockPointerDown({ event, block, page, pageElement, editorState, controller });
      },
      contextmenu: (event) => {
        event.preventDefault();
        event.stopPropagation();
        controller.openBlockContextMenu(block.id, event.clientX, event.clientY, readEditedText);
      },
    },
  });

  const content = el("div", {
    className: "block__content block__content--text",
    textContent: block.props.text,
    dataset: { editableId: block.id },
    on: {
      pointerdown: (event) => {
        if (isEditing) event.stopPropagation();
      },
      keydown: (event) => {
        if (!isEditing) return;

        if (event.key === "Enter" && !event.shiftKey) {
          event.preventDefault();
          controller.commitTextEdit(readEditedText);
        }

        if (event.key === "Escape") {
          event.preventDefault();
          controller.cancelTextEdit();
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
        pointerdown: (event) => handleResizePointerDown({ event, block, pageElement, controller }),
      },
    }));
  }

  return blockElement;
}

export function renderBlock(args) {
  if (args.block.type === BLOCK_TYPES.text) {
    return renderTextBlock(args);
  }

  return el("article", {
    className: "block block--unknown",
    style: frameToCss(args.block.frame),
    textContent: `Bloque desconocido: ${args.block.type}`,
  });
}
