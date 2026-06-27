import { BLOCK_TYPES } from "./blockTypes.js";

export const LINE_BLOCK_DEFAULT_PROPS = {
  style: {
    backgroundColor: "#ffffff",
    backgroundOpacity: 0,
    textColor: "#111827",
    textOpacity: 1,
    fontFamily: "Arial",
    fontSizePt: 11,
    hasBorder: false,
    borderRadiusMm: 0,
    layer: 2,
    bold: false,
    italic: false,
    strike: false,
  },
  line: {
    start: { x: 0, y: 1 },
    end: { x: 40, y: 1 },
    thicknessMm: 0.75,
    useMillimeterSnap: false,
  },
};

export const LINE_BLOCK_DEFINITION = {
  type: BLOCK_TYPES.line,
  label: "Línea",
  iconClass: "fa-solid fa-slash",
  defaultFrame: {
    x: 10,
    y: 10,
    width: 40,
    height: 2,
  },
  defaultProps: LINE_BLOCK_DEFAULT_PROPS,
};
