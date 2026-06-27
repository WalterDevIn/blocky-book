import { getCommonStyle, getTextStyle } from "../blocks/blockStyle.js";
import { isEditingBlock } from "../editor/editorSelectors.js";
import { el } from "../shared/dom.js";
import { createBlockElement, createEditableTextElement } from "./blockChrome.js";
import { textContainerStyleToCss, textStyleToCss } from "./blockStyleCss.js";

export function renderLabeledBlock({ block, page, pageElement, editorState, controller }) {
  const isEditing = isEditingBlock(editorState, block.id);
  const commonStyle = getCommonStyle(block);
  const textStyle = getTextStyle(block);
  const label = getLabelProps(block);

  const content = el("div", {
    className: "block__content block__content--labeled",
    style: textContainerStyleToCss(textStyle),
    on: {
      pointerdown: (event) => {
        if (isEditing) event.stopPropagation();
      },
    },
  }, [
    createEditableTextElement({
      block,
      isEditing,
      controller,
      style: textStyleToCss(textStyle),
    }),
    label.position === "placeholder" && !block.props.text
      ? el("span", { className: "labeled-block__placeholder", textContent: label.text })
      : null,
  ]);

  return createBlockElement({
    block,
    page,
    pageElement,
    editorState,
    controller,
    commonStyle,
    children: [
      label.position === "placeholder" ? null : el("span", {
        className: `labeled-block__label labeled-block__label--${label.position}`,
        textContent: label.text,
        style: { fontSize: `${label.fontSizePt}pt` },
      }),
      content,
    ],
  });
}

function getLabelProps(block) {
  return {
    text: block.props.label?.text ?? "Etiqueta",
    position: block.props.label?.position ?? "fieldsetTopLeft",
    fontSizePt: block.props.label?.fontSizePt ?? 8,
  };
}
