import { BLOCK_TYPES } from "./blockTypes.js";

export const TEXT_BLOCK_DEFAULT_PROPS = {
  text: "Texto",
  fontFamily: "Arial",
  fontSizePt: 11,
  textAlign: "center",
  verticalAlign: "middle",
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
