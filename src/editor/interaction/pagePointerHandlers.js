import { readEditedText } from "../textEditing.js";
import { startMarqueeSelectionSession } from "./marqueeSelectionSession.js";

const INTERACTIVE_PAGE_TARGET_SELECTOR = ".block, .resize-handle, .context-menu";

export function createPagePointerHandlers({ page, pageElement, editorState, controller }) {
  return {
    pointerdown(event) {
      if (isInteractivePageTarget(event.target)) return;

      if (event.button === 2) {
        startMarqueeSelectionSession({ event, page, pageElement, editorState, controller });
        return;
      }

      controller.clearSelection(readEditedText);
    },

    contextmenu(event) {
      event.preventDefault();
    },
  };
}

function isInteractivePageTarget(target) {
  return Boolean(target.closest?.(INTERACTIVE_PAGE_TARGET_SELECTOR));
}
