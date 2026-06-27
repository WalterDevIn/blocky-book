import { el } from "../shared/dom.js";
import { frameToCss } from "../shared/geometry.js";
import { getBlockRenderer } from "./blockRendererRegistry.js";

export function renderBlock(args) {
  const renderer = getBlockRenderer(args.block.type);
  if (renderer) return renderer(args);

  return el("article", {
    className: "block block--unknown",
    style: frameToCss(args.block.frame),
    textContent: `Bloque desconocido: ${args.block.type}`,
  });
}
