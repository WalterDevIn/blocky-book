import { SPREAD_LAYOUTS } from "../document/documentFactory.js";
import { isSelectedBlock } from "../editor/editorSelectors.js";
import { el } from "../shared/dom.js";
import { getBlockDisplayName } from "./propertyPanel/blockDisplayName.js";

export function renderPageTreeSidebar({ editorState, controller }) {
  const pageItems = getPageTreeItems(editorState.document.spreads);
  const isCollapsed = editorState.ui?.sidebarCollapsed === true;

  return el("aside", { className: `page-tree-sidebar${isCollapsed ? " is-collapsed" : ""}` }, [
    el("div", { className: "page-tree-sidebar__header" }, [
      isCollapsed ? null : el("div", { className: "page-tree-sidebar__title", textContent: "Páginas" }),
      isCollapsed ? null : el("div", { className: "page-tree-sidebar__count", textContent: `${pageItems.length}` }),
      el("button", {
        className: "page-tree-sidebar__toggle",
        type: "button",
        title: isCollapsed ? "Abrir barra lateral" : "Plegar barra lateral",
        on: { click: () => controller.toggleSidebarCollapsed() },
      }, [
        el("i", {
          className: isCollapsed ? "fa-solid fa-chevron-right" : "fa-solid fa-chevron-left",
          attrs: { "aria-hidden": "true" },
        }),
      ]),
    ]),
    isCollapsed ? null : el("nav", { className: "page-tree", attrs: { "aria-label": "Árbol de páginas" } }, [
      el("div", { className: "page-tree__root" }, pageItems.map((item) => renderPageItem({ item, editorState, controller }))),
    ]),
  ]);
}

function renderPageItem({ item, editorState, controller }) {
  const collapsedPageIds = new Set(editorState.ui?.collapsedPageIds ?? []);
  const isCollapsed = collapsedPageIds.has(item.page.id);
  const blockCount = item.page.blocks.length;

  return el("div", { className: "page-tree__item", dataset: { pageId: item.page.id } }, [
    el("button", {
      className: "page-tree__page-button",
      type: "button",
      title: `${item.label} · ${blockCount} elemento${blockCount === 1 ? "" : "s"}`,
      on: { click: () => controller.togglePageTreeNode(item.page.id) },
    }, [
      el("i", {
        className: isCollapsed ? "fa-solid fa-caret-right" : "fa-solid fa-caret-down",
        attrs: { "aria-hidden": "true" },
      }),
      el("i", { className: getPageIconClass(item), attrs: { "aria-hidden": "true" } }),
      el("span", { className: "page-tree__page-name", textContent: item.label }),
      el("span", { className: "page-tree__page-side", textContent: item.sideLabel }),
      el("span", { className: "page-tree__page-count", textContent: `${blockCount}` }),
    ]),
    isCollapsed ? null : renderPageBlocks({ item, editorState }),
  ]);
}

function renderPageBlocks({ item, editorState }) {
  if (item.page.blocks.length === 0) {
    return el("div", { className: "page-tree__children page-tree__children--empty", textContent: "Sin elementos" });
  }

  return el("div", { className: "page-tree__children" }, item.page.blocks.map((block, index) => renderBlockItem({
    block,
    index,
    editorState,
  })));
}

function renderBlockItem({ block, index, editorState }) {
  return el("button", {
    className: `page-tree__block-button${isSelectedBlock(editorState, block.id) ? " is-selected" : ""}`,
    type: "button",
    title: getBlockDisplayName(block),
  }, [
    el("i", { className: getBlockIconClass(block), attrs: { "aria-hidden": "true" } }),
    el("span", { className: "page-tree__block-name", textContent: `${index + 1}. ${getBlockDisplayName(block)}` }),
  ]);
}

function getPageTreeItems(spreads) {
  const items = [];
  let pageNumber = 1;

  spreads.forEach((spread) => {
    spread.pages.forEach((page, pageIndex) => {
      const side = getPageSide({ spread, pageIndex });
      items.push({
        page,
        side,
        label: `Página ${pageNumber}`,
        sideLabel: side === "left" ? "Izq." : "Der.",
      });
      pageNumber += 1;
    });
  });

  return items;
}

function getPageSide({ spread, pageIndex }) {
  if (spread.layout === SPREAD_LAYOUTS.singleStart) return "right";
  if (spread.layout === SPREAD_LAYOUTS.singleEnd) return "left";
  return pageIndex === 0 ? "left" : "right";
}

function getPageIconClass(item) {
  return item.side === "left" ? "fa-regular fa-file-lines" : "fa-regular fa-file";
}

function getBlockIconClass(block) {
  if (block.type === "text") return "fa-solid fa-font";
  if (block.type === "line") return "fa-solid fa-slash";
  if (block.type === "ruledText") return "fa-solid fa-align-left";
  if (block.type === "gridBlock") return "fa-solid fa-table-cells";
  if (block.type === "image") return "fa-regular fa-image";
  if (block.type === "icon") return "fa-regular fa-star";
  if (block.type === "labeled") return "fa-solid fa-tag";
  return "fa-regular fa-square";
}
