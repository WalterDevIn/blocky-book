import { getCommonStyle, getTextStyle } from "../blocks/blockStyle.js";
import { isEditingBlock } from "../editor/editorSelectors.js";
import { el } from "../shared/dom.js";
import { createBlockElement, createEditableTextElement } from "./blockChrome.js";
import { textContainerStyleToCss, textStyleToCss } from "./blockStyleCss.js";

export function renderTextBlock({ block, page, pageElement, editorState, controller }) {
  const isEditing = isEditingBlock(editorState, block.id);
  const commonStyle = getCommonStyle(block);
  const textStyle = getTextStyle(block);

  const content = el("div", {
    className: "block__content block__content--text",
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
  ]);

  return createBlockElement({
    block,
    page,
    pageElement,
    editorState,
    controller,
    commonStyle,
    children: [content],
  });
}
