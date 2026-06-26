import { readEditedText } from "../editor/textEditing.js";
import { el } from "../shared/dom.js";
import { renderBlock } from "./renderBlock.js";

export function renderCanvas({ editorState, controller }) {
  const viewport = el("main", { className: "editor-viewport" });
  const spreadsElement = el("div", { className: "spreads" });

  let pageNumber = 1;

  editorState.document.spreads.forEach((spread) => {
    const spreadElement = el("div", { className: "spread" });

    spread.pages.forEach((page) => {
      const pageElement = renderPage({ page, pageNumber, editorState, controller });
      spreadElement.appendChild(pageElement);
      pageNumber += 1;
    });

    spreadsElement.appendChild(spreadElement);
  });

  viewport.appendChild(spreadsElement);
  return viewport;
}

function renderPage({ page, pageNumber, editorState, controller }) {
  const pageElement = el("section", {
    className: `page${editorState.viewport.showGrid ? " is-grid-visible" : ""}`,
    dataset: { pageId: page.id },
    on: {
      pointerdown: (event) => {
        if (event.target !== pageElement) return;
        controller.clearSelection(readEditedText);
      },
      contextmenu: (event) => {
        event.preventDefault();
        controller.clearSelection(readEditedText);
      },
    },
  });

  page.blocks.forEach((block) => {
    pageElement.appendChild(renderBlock({ block, page, pageElement, editorState, controller }));
  });

  pageElement.appendChild(el("div", {
    className: "page__label",
    textContent: `Hoja ${pageNumber}`,
  }));

  return pageElement;
}
