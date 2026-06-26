import { pointerToPageMm, safeReleasePointerCapture } from "../../shared/geometry.js";
import { getResizedFrame, setBlockElementFrame } from "./frameMath.js";

export function startBlockResizeSession({ event, block, pageElement, controller }) {
  event.stopPropagation();
  event.preventDefault();

  const blockElement = event.currentTarget.closest(".block");
  const startPointer = pointerToPageMm(event, pageElement);
  const startFrame = { ...block.frame };
  let latestFrame = { ...startFrame };

  pageElement.setPointerCapture?.(event.pointerId);

  const move = (moveEvent) => {
    latestFrame = getResizedFrame(moveEvent, {
      block,
      pageElement,
      startPointer,
      startFrame,
    });

    setBlockElementFrame(blockElement, latestFrame);
  };

  const up = (upEvent) => {
    safeReleasePointerCapture(pageElement, upEvent.pointerId);
    window.removeEventListener("pointermove", move);
    window.removeEventListener("pointerup", up);
    controller.commitBlockResize(block.id, latestFrame);
  };

  window.addEventListener("pointermove", move);
  window.addEventListener("pointerup", up);
}
