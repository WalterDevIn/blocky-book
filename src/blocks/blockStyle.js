export const DEFAULT_COMMON_STYLE = {
  backgroundColor: "#ffffff",
  backgroundOpacity: 0,
  backgroundColorId: "",
  textColor: "#1f2328",
  textOpacity: 1,
  textColorId: "",
  borderColor: "#8b96a5",
  borderOpacity: 1,
  borderColorId: "",
  fontFamily: "Arial",
  fontSizePt: 11,
  hasBorder: true,
  borderRadiusMm: 0,
  layer: 2,
  bold: false,
  italic: false,
  strike: false,
};

export const DEFAULT_TEXT_STYLE = {
  horizontalAlign: "center",
  verticalAlign: "middle",
  paddingMm: 1,
};

export const DEFAULT_LINE_STYLE = {
  angleDeg: 0,
  thicknessMm: 0.75,
};

export const DEFAULT_RULED_TEXT_STYLE = {
  horizontalAlign: "left",
  lineVerticalAlign: "middle",
  paddingMm: 1,
  lineHeightMm: 5,
  showLines: true,
  lineColor: "#94a3b8",
  lineOpacity: 0.45,
};

export const DEFAULT_INTERNAL_GRID_STYLE = {
  color: "#94a3b8",
  opacity: 0.45,
  sizeMm: 5,
};

export function getCommonStyle(block) {
  const nextStyle = {
    ...DEFAULT_COMMON_STYLE,
    fontFamily: block.props.fontFamily ?? DEFAULT_COMMON_STYLE.fontFamily,
    fontSizePt: block.props.fontSizePt ?? DEFAULT_COMMON_STYLE.fontSizePt,
    ...block.props.style,
  };

  return {
    ...nextStyle,
    backgroundColorId: nextStyle.backgroundColorId ?? "",
    textColorId: nextStyle.textColorId ?? "",
    borderColorId: nextStyle.borderColorId ?? "",
    backgroundOpacity: clampNumber(nextStyle.backgroundOpacity, 0, 1, DEFAULT_COMMON_STYLE.backgroundOpacity),
    textOpacity: clampNumber(nextStyle.textOpacity, 0, 1, DEFAULT_COMMON_STYLE.textOpacity),
    borderOpacity: clampNumber(nextStyle.borderOpacity, 0, 1, DEFAULT_COMMON_STYLE.borderOpacity),
  };
}

export function getTextStyle(block) {
  const nextStyle = {
    ...DEFAULT_TEXT_STYLE,
    horizontalAlign: block.props.textAlign ?? DEFAULT_TEXT_STYLE.horizontalAlign,
    verticalAlign: block.props.verticalAlign ?? DEFAULT_TEXT_STYLE.verticalAlign,
    ...block.props.textStyle,
  };

  return {
    ...nextStyle,
    horizontalAlign: normalizeHorizontalAlign(nextStyle.horizontalAlign),
    verticalAlign: normalizeVerticalAlign(nextStyle.verticalAlign),
    paddingMm: normalizePaddingMm(nextStyle, DEFAULT_TEXT_STYLE.paddingMm),
  };
}

export function getLineStyle(block) {
  return {
    ...DEFAULT_LINE_STYLE,
    ...block.props.line,
  };
}

export function getRuledTextStyle(block) {
  const nextStyle = {
    ...DEFAULT_RULED_TEXT_STYLE,
    ...block.props.ruledText,
  };

  return {
    ...nextStyle,
    horizontalAlign: normalizeHorizontalAlign(nextStyle.horizontalAlign),
    lineVerticalAlign: normalizeVerticalAlign(nextStyle.lineVerticalAlign),
    paddingMm: normalizePaddingMm(nextStyle, DEFAULT_RULED_TEXT_STYLE.paddingMm),
    lineHeightMm: 5,
    showLines: nextStyle.showLines !== false,
    lineOpacity: clampNumber(nextStyle.lineOpacity, 0, 1, DEFAULT_RULED_TEXT_STYLE.lineOpacity),
  };
}

export function getInternalGridStyle(block) {
  const nextStyle = {
    ...DEFAULT_INTERNAL_GRID_STYLE,
    ...block.props.internalGrid,
  };

  return {
    ...nextStyle,
    opacity: clampNumber(nextStyle.opacity, 0, 1, DEFAULT_INTERNAL_GRID_STYLE.opacity),
    sizeMm: 5,
  };
}

function normalizeHorizontalAlign(value) {
  if (["left", "center", "right"].includes(value)) return value;
  return DEFAULT_TEXT_STYLE.horizontalAlign;
}

function normalizeVerticalAlign(value) {
  if (["start", "middle", "end"].includes(value)) return value;
  if (value === "top") return "start";
  if (value === "center") return "middle";
  if (value === "bottom") return "end";
  return DEFAULT_TEXT_STYLE.verticalAlign;
}

function normalizePaddingMm(textStyle, defaultValue) {
  if (typeof textStyle.paddingMm === "number") return textStyle.paddingMm;
  if (textStyle.hasPadding === false) return 0;
  return defaultValue;
}

function clampNumber(value, min, max, fallback = min) {
  if (typeof value !== "number") return fallback;
  return Math.min(Math.max(value, min), max);
}
