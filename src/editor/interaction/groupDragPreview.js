export function createGroupDragPreview({ pageElement, blockIds }) {
  const previews = blockIds
    .map((blockId) => {
      const element = pageElement.querySelector(`[data-block-id="${blockId}"]`);
      if (!element) return null;

      element.classList.add("is-drag-source");
      return {
        element,
        frame: readFrameFromElement(element),
      };
    })
    .filter(Boolean);

  const bounds = getGroupBounds(previews);
  const outline = bounds ? createGroupOutline({ pageElement, bounds }) : null;

  return {
    move(delta) {
      if (!outline || !bounds) return;

      outline.style.left = `${bounds.x + delta.x}mm`;
      outline.style.top = `${bounds.y + delta.y}mm`;
    },

    clear() {
      previews.forEach((preview) => {
        preview.element.classList.remove("is-drag-source");
      });
      outline?.remove();
    },
  };
}

function createGroupOutline({ pageElement, bounds }) {
  const outline = document.createElement("div");
  outline.className = "group-drag-outline is-picking";
  outline.style.left = `${bounds.x}mm`;
  outline.style.top = `${bounds.y}mm`;
  outline.style.width = `${bounds.width}mm`;
  outline.style.height = `${bounds.height}mm`;

  pageElement.appendChild(outline);
  window.setTimeout(() => {
    outline.classList.remove("is-picking");
    outline.classList.add("is-dragging");
  }, 150);

  return outline;
}

function getGroupBounds(previews) {
  if (previews.length === 0) return null;

  const minX = Math.min(...previews.map((preview) => preview.frame.x));
  const minY = Math.min(...previews.map((preview) => preview.frame.y));
  const maxX = Math.max(...previews.map((preview) => preview.frame.x + preview.frame.width));
  const maxY = Math.max(...previews.map((preview) => preview.frame.y + preview.frame.height));

  return {
    x: minX,
    y: minY,
    width: Math.max(maxX - minX, 1),
    height: Math.max(maxY - minY, 1),
  };
}

function readFrameFromElement(element) {
  return {
    x: parseMm(element.style.left),
    y: parseMm(element.style.top),
    width: parseMm(element.style.width),
    height: parseMm(element.style.height),
  };
}

function parseMm(value) {
  return Number.parseFloat(String(value).replace("mm", "")) || 0;
}
