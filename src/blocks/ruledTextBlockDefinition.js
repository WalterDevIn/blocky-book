import { BLOCK_TYPES } from "./blockTypes.js";

export const RULED_TEXT_BLOCK_DEFAULT_PROPS = {
  text: "Texto en líneas",
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
    showLines: true,
    lineColor: "#94a3b8",
    lineOpacity: 0.45,
  },
};

export const RULED_TEXT_BLOCK_DEFINITION = {
  type: BLOCK_TYPES.ruledText,
  label: "Texto normal",
  iconClass: "fa-solid fa-align-left",
  defaultFrame: {
    x: 10,
    y: 10,
    width: 65,
    height: 35,
  },
  defaultProps: RULED_TEXT_BLOCK_DEFAULT_PROPS,
};
