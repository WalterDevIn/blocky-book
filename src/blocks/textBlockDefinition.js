import { BLOCK_TYPES } from "./blockTypes.js";

export const TEXT_BLOCK_DEFAULT_PROPS = {
  text: "Texto",
  style: {
    backgroundColor: "#ffffff",
    fontFamily: "Arial",
    fontSizePt: 11,
    hasBorder: true,
    borderRadiusMm: 0,
    layer: 2,
    bold: false,
    italic: false,
    strike: false,
  },
  textStyle: {
    horizontalAlign: "center",
    verticalAlign: "middle",
    paddingMm: 1,
  },
};

export const TEXT_BLOCK_DEFINITION = {
  type: BLOCK_TYPES.text,
  label: "Texto",
  iconClass: "fa-solid fa-font",
  defaultFrame: {
    x: 10,
    y: 10,
    width: 35,
    height: 15,
  },
  defaultProps: TEXT_BLOCK_DEFAULT_PROPS,
};
