import { readEditedText } from "../editor/textEditing.js";
import { el } from "../shared/dom.js";
import { renderBlock } from "./renderBlock.js";
import { renderRingMargin } from "./renderRingMargin.js";

export function renderCanvas({ editorState, controller }) {
  const viewport = el("main", { className: "editor-viewport" });
  const spreadsElement = el("div", { className: "spreads" });

  let pageNumber = 1;

  editorState.document.spreads.forEach((spread) => {
    const spreadElement = el("div", { className: "spread" });

    spread.pages.forEach((page, pageIndex) => {
      const pageSide = pageIndex === 0 ? "left" : "right";
      const pageElement = renderPage({ page, pageNumber, pageSide, editorState, controller });
      spreadElement.appendChild(pageElement);
      pageNumber += 1;
    });

    spreadsElement.appendChild(spreadElement);
  });

  viewport.appendChild(spreadsElement);
  return viewport;
}

function renderPage({ page, pageNumber, pageSide, editorState, controller }) {
  const pageSpec = editorState.document.pageSpec;
  const pageElement = el("section", {
    className: `page page--${pageSide}${editorState.viewport.showGrid ? " is-grid-visible" : ""}`,
    dataset: { pageId: page.id },
    style: {
      width: `${pageSpec.widthMm}mm`,
      height: `${pageSpec.heightMm}mm`,
      backgroundColor: pageSpec.background,
      backgroundSize: editorState.viewport.showGrid ? `${pageSpec.gridMm}mm ${pageSpec.gridMm}mm` : undefined,
    },
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

  if (editorState.viewport.showPageMargin) {
    pageElement.appendChild(renderRingMargin({ pageSide }));
  }

  page.blocks.forEach((block) => {
    pageElement.appendChild(renderBlock({ block, page, pageElement, editorState, controller }));
  });

  pageElement.appendChild(el("div", {
    className: "page__label",
    textContent: `Hoja ${pageNumber}`,
  }));

  return pageElement;
}
