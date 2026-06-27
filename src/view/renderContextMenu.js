import { findBlockById } from "../document/documentQueries.js";
import { getSelectedBlocks } from "../editor/selectionHelpers.js";
import { el } from "../shared/dom.js";
import {
  getBlockDisplayName,
  renderCommonProperties,
  renderSpecificProperties,
  renderTypographyProperties,
} from "./blockPropertySections.js";
import { getFloatingMenuStyle } from "./floatingMenuPosition.js";

export function renderContextMenu({ editorState, controller }) {
  const menu = editorState.interaction.contextMenu;
  if (!menu) return null;

  const selected = getSelectedBlocks(editorState);
  const fallback = findBlockById(editorState.document, menu.blockId);
  const targets = selected.length > 0 ? selected : fallback ? [fallback] : [];
  if (targets.length === 0) return null;

  const blocks = targets.map((target) => target.block);
  const primaryBlock = blocks[0];
  const sameType = blocks.every((block) => block.type === primaryBlock.type);
  const title = blocks.length === 1
    ? `Editar ${getBlockDisplayName(primaryBlock)}`
    : sameType
      ? `Editar ${blocks.length} ${getBlockDisplayName(primaryBlock)}`
      : `Editar ${blocks.length} bloques`;

  return el("div", {
    className: "context-menu property-menu",
    style: getFloatingMenuStyle({ x: menu.x, y: menu.y, width: 300 }),
    on: {
      pointerdown: (event) => event.stopPropagation(),
      pointerup: (event) => event.stopPropagation(),
      click: (event) => event.stopPropagation(),
      keydown: (event) => event.stopPropagation(),
      contextmenu: (event) => event.preventDefault(),
    },
  }, [
    el("div", { className: "context-menu__title", textContent: title }),
    renderCommonProperties({ block: primaryBlock, editorState, controller }),
    renderTypographyProperties({ block: primaryBlock, controller }),
    sameType ? renderSpecificProperties({ block: primaryBlock, controller }) : null,
  ]);
}
