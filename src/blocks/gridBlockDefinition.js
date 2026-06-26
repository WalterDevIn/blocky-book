import { BLOCK_TYPES } from "./blockTypes.js";

export const GRID_BLOCK_DEFAULT_PROPS = {
  text: "Texto en cuadrícula",
  style: {
    backgroundColor: "#ffffff",
    textColor: "#1f2328",
    fontFamily: "Arial",
    fontSizePt: 10,
    hasBorder: true,
    borderRadiusMm: 0,
    layer: 2,
    bold: false,
    italic: false,
    strike: false,
  },
  ruledText: {
    horizontalAlign: "left",
    lineVerticalAlign: "middle",
    paddingMm: 1,
    lineHeightMm: 5,
    showLines: false,
    lineColor: "#94a3b8",
    lineOpacity: 0.45,
  },
  internalGrid: {
    color: "#94a3b8",
    opacity: 0.45,
    sizeMm: 5,
  },
};

export const GRID_BLOCK_DEFINITION = {
  type: BLOCK_TYPES.gridBlock,
  label: "Cuadrícula",
  iconClass: "fa-solid fa-border-all",
  defaultFrame: {
    x: 10,
    y: 10,
    width: 65,
    height: 35,
  },
  defaultProps: GRID_BLOCK_DEFAULT_PROPS,
};
