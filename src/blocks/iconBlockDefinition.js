import { BLOCK_TYPES } from "./blockTypes.js";

export const ICON_BLOCK_DEFAULT_PROPS = {
  style: {
    backgroundColor: "#ffffff",
    textColor: "#1f2328",
    fontFamily: "Arial",
    fontSizePt: 24,
    hasBorder: true,
    borderRadiusMm: 0,
    layer: 2,
    bold: false,
    italic: false,
    strike: false,
  },
  icon: {
    className: "fa-solid fa-star",
  },
};

export const ICON_BLOCK_DEFINITION = {
  type: BLOCK_TYPES.icon,
  label: "Ícono",
  iconClass: "fa-solid fa-icons",
  defaultFrame: {
    x: 10,
    y: 10,
    width: 15,
    height: 15,
  },
  defaultProps: ICON_BLOCK_DEFAULT_PROPS,
};
