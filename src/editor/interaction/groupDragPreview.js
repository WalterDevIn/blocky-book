export function createGroupDragPreview({ pageElement, blockIds, sourceBlockId }) {
  const previews = blockIds
    .filter((blockId) => blockId !== sourceBlockId)
    .map((blockId) => {
      const element = pageElement.querySelector(`[data-block-id="${blockId}"]`);
      if (!element) return null;

      return {
        element,
        startLeft: element.style.left,
        startTop: element.style.top,
        startFrame: readFrameFromElement(element),
      };
    })
    .filter(Boolean);

  previews.forEach((preview) => {
    preview.element.classList.add("is-group-drag-preview");
  });

  return {
    move(delta) {
      previews.forEach((preview) => {
        preview.element.style.left = `${preview.startFrame.x + delta.x}mm`;
        preview.element.style.top = `${preview.startFrame.y + delta.y}mm`;
      });
    },

    clear() {
      previews.forEach((preview) => {
        preview.element.classList.remove("is-group-drag-preview");
        preview.element.style.left = preview.startLeft;
        preview.element.style.top = preview.startTop;
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
