import { startBlockDragSession } from "./interaction/blockDragSession.js";
import { startBlockResizeSession } from "./interaction/blockResizeSession.js";

export function handleBlockPointerDown(args) {
  startBlockDragSession(args);
}

export function handleResizePointerDown(args) {
  startBlockResizeSession(args);
}
