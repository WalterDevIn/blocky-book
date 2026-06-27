export function createGroupDragPreview({ pageElement, blockIds, sourceBlockId }) {
  const previews = blockIds
    .filter((blockId) => blockId !== sourceBlockId)
    .map((blockId) => {
      const element = pageElement.querySelector(`[data-block-id="${blockId}"]`);
      if (!element) return null;

      const ghost = element.cloneNode(true);
      ghost.classList.remove("is-selected", "is-editing", "is-dropping");
      ghost.classList.add("is-group-drag-ghost");
      ghost.style.left = element.style.left;
      ghost.style.top = element.style.top;
      ghost.style.width = element.style.width;
      ghost.style.height = element.style.height;
      ghost.querySelectorAll(".resize-handle").forEach((handle) => handle.remove());

      element.classList.add("is-drag-source");
      pageElement.appendChild(ghost);

      return {
        element,
        ghost,
        startFrame: readFrameFromElement(element),
      };
    })
    .filter(Boolean);

  return {
    move(delta) {
      previews.forEach((preview) => {
        preview.ghost.style.left = `${preview.startFrame.x + delta.x}mm`;
        preview.ghost.style.top = `${preview.startFrame.y + delta.y}mm`;
      });
    },

    clear() {
      previews.forEach((preview) => {
        preview.element.classList.remove("is-drag-source");
        preview.ghost.remove();
      });
    },
  };
}

function readFrameFromElement(element) {
  return {
    x: parseMm(element.style.left),
    y: parseMm(element.style.top),
  };
}

function parseMm(value) {
  return Number.parseFloat(String(value).replace("mm", "")) || 0;
}
