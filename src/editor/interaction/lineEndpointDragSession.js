import { PAGE_SPEC } from "../../document/printSpec.js";
import { clamp, pointerToPageMm, safeReleasePointerCapture, snapMm } from "../../shared/geometry.js";

const MIN_LINE_FRAME_MM = 1;

export function startLineEndpointDragSession({ event, block, endpoint, pageElement, controller }) {
  event.stopPropagation();
  event.preventDefault();

  const startLine = getLineProps(block);
  const fixedEndpoint = endpoint === "start" ? startLine.end : startLine.start;
  let latestUpdate = null;

  pageElement.setPointerCapture?.(event.pointerId);

  const move = (moveEvent) => {
    const pointer = pointerToPageMm(moveEvent, pageElement);
    const snapStepMm = startLine.useMillimeterSnap ? 1 : PAGE_SPEC.gridMm;
    const movingPoint = {
      x: clamp(snapMm(pointer.x, snapStepMm), 0, PAGE_SPEC.widthMm),
      y: clamp(snapMm(pointer.y, snapStepMm), 0, PAGE_SPEC.heightMm),
    };
    const fixedPoint = {
      x: block.frame.x + fixedEndpoint.x,
      y: block.frame.y + fixedEndpoint.y,
    };

    latestUpdate = buildLineUpdate({
      endpoint,
      movingPoint,
      fixedPoint,
      thicknessMm: startLine.thicknessMm,
      useMillimeterSnap: startLine.useMillimeterSnap,
    });

    controller.updateBlockFrameAndProps(block.id, latestUpdate.frame, { line: latestUpdate.line }, { shouldRender: false });
    updateLiveLineElement(block.id, latestUpdate);
  };

  const up = (upEvent) => {
    safeReleasePointerCapture(pageElement, upEvent.pointerId);
    window.removeEventListener("pointermove", move);
    window.removeEventListener("pointerup", up);

    if (latestUpdate) {
      controller.updateBlockFrameAndProps(block.id, latestUpdate.frame, { line: latestUpdate.line });
    }
  };

  window.addEventListener("pointermove", move);
  window.addEventListener("pointerup", up);
}

function getLineProps(block) {
  const line = block.props.line ?? {};
  return {
    start: line.start ?? { x: 0, y: block.frame.height / 2 },
    end: line.end ?? { x: block.frame.width, y: block.frame.height / 2 },
    thicknessMm: line.thicknessMm ?? 0.75,
    useMillimeterSnap: line.useMillimeterSnap === true,
  };
}

function buildLineUpdate({ endpoint, movingPoint, fixedPoint, thicknessMm, useMillimeterSnap }) {
  const startPoint = endpoint === "start" ? movingPoint : fixedPoint;
  const endPoint = endpoint === "end" ? movingPoint : fixedPoint;
  const minX = Math.min(startPoint.x, endPoint.x);
  const minY = Math.min(startPoint.y, endPoint.y);
  const maxX = Math.max(startPoint.x, endPoint.x);
  const maxY = Math.max(startPoint.y, endPoint.y);
  const width = Math.max(maxX - minX, MIN_LINE_FRAME_MM);
  const height = Math.max(maxY - minY, MIN_LINE_FRAME_MM);
  const frame = {
    x: clamp(minX, 0, PAGE_SPEC.widthMm - width),
    y: clamp(minY, 0, PAGE_SPEC.heightMm - height),
    width,
    height,
  };

  return {
    frame,
    line: {
      start: {
        x: startPoint.x - frame.x,
        y: startPoint.y - frame.y,
      },
      end: {
        x: endPoint.x - frame.x,
        y: endPoint.y - frame.y,
      },
      thicknessMm,
      useMillimeterSnap,
    },
  };
}

function updateLiveLineElement(blockId, update) {
  const blockElement = document.querySelector(`[data-block-id="${blockId}"]`);
  if (!blockElement) return;

  blockElement.style.left = `${update.frame.x}mm`;
  blockElement.style.top = `${update.frame.y}mm`;
  blockElement.style.width = `${update.frame.width}mm`;
  blockElement.style.height = `${update.frame.height}mm`;

  const lineElement = blockElement.querySelector(".line-block__segment");
  if (lineElement) {
    lineElement.setAttribute("x1", `${update.line.start.x}`);
    lineElement.setAttribute("y1", `${update.line.start.y}`);
    lineElement.setAttribute("x2", `${update.line.end.x}`);
    lineElement.setAttribute("y2", `${update.line.end.y}`);
  }

  blockElement.querySelectorAll(".line-endpoint-handle").forEach((handle) => {
    const endpoint = handle.dataset.endpoint;
    const point = endpoint === "start" ? update.line.start : update.line.end;
    handle.style.left = `${point.x}mm`;
    handle.style.top = `${point.y}mm`;
  });
}
