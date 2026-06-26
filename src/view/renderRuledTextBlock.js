import { getCommonStyle, getRuledTextStyle } from "../blocks/blockStyle.js";
import { isEditingBlock } from "../editor/editorSelectors.js";
import { el } from "../shared/dom.js";
import { createBlockElement, createEditableTextElement } from "./blockChrome.js";
import { ruledTextContainerStyleToCss, ruledTextStyleToCss } from "./blockStyleCss.js";

export function renderRuledTextBlock({ block, page, pageElement, editorState, controller }) {
  const isEditing = isEditingBlock(editorState, block.id);
  const commonStyle = getCommonStyle(block);
  const ruledTextStyle = getRuledTextStyle(block);

  const content = el("div", {
    className: "block__content block__content--ruled-text",
    style: ruledTextContainerStyleToCss(ruledTextStyle),
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
      className: "block__text block__text--ruled",
      style: ruledTextStyleToCss(ruledTextStyle),
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
