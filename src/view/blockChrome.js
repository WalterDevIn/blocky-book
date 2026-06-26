import { handleBlockPointerDown, handleResizePointerDown } from "../editor/blockInteraction.js";
import { isEditingBlock } from "../editor/editorSelectors.js";
import { readEditedText } from "../editor/textEditing.js";
import { el } from "../shared/dom.js";
import { frameToCss } from "../shared/geometry.js";
import { commonStyleToCss } from "./blockStyleCss.js";

export function createBlockElement({ block, page, pageElement, editorState, controller, commonStyle, children = [], style = {} }) {
  const isSelected = editorState.selection.blockId === block.id;
  const isEditing = isEditingBlock(editorState, block.id);

  const blockElement = el("article", {
    className: getBlockClassName({ block, editorState, isSelected, isEditing }),
    style: {
      ...frameToCss(block.frame),
      ...commonStyleToCss(commonStyle),
      ...style,
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
  }, children);

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

export function createEditableTextElement({ block, isEditing, className = "block__text", style = {}, controller }) {
  const text = el("div", {
    className,
    textContent: block.props.text,
    dataset: { editableId: block.id },
    style,
    on: {
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

  text.contentEditable = isEditing ? "true" : "false";
  return text;
}

function getBlockClassName({ block, editorState, isSelected, isEditing }) {
  return [
    "block",
    `block--${block.type}`,
    isSelected ? "is-selected" : "",
    isEditing ? "is-editing" : "",
    editorState.interaction.pickingBlockId === block.id ? "is-picking" : "",
    editorState.interaction.draggingBlockId === block.id ? "is-dragging" : "",
    editorState.interaction.droppingBlockId === block.id ? "is-dropping" : "",
  ].filter(Boolean).join(" ");
}
