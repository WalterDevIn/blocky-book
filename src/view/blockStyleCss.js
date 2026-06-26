export function commonStyleToCss(commonStyle) {
  return {
    zIndex: String(commonStyle.layer),
    backgroundColor: commonStyle.backgroundColor,
    borderStyle: commonStyle.hasBorder ? "solid" : "none",
    borderRadius: `${commonStyle.borderRadiusMm}mm`,
    fontFamily: commonStyle.fontFamily,
    fontSize: `${commonStyle.fontSizePt}pt`,
    fontWeight: commonStyle.bold ? "700" : "400",
    fontStyle: commonStyle.italic ? "italic" : "normal",
    textDecoration: commonStyle.strike ? "line-through" : "none",
  };
}

export function textContainerStyleToCss(textStyle) {
  return {
    padding: `${textStyle.paddingMm}mm`,
    justifyItems: horizontalAlignToGridValue(textStyle.horizontalAlign),
    alignItems: verticalAlignToGridValue(textStyle.verticalAlign),
  };
}

export function textStyleToCss(textStyle) {
  return {
    textAlign: textStyle.horizontalAlign,
  };
}

export function ruledTextContainerStyleToCss(ruledTextStyle) {
  return {
    padding: `${ruledTextStyle.paddingMm}mm`,
  };
}

export function ruledTextStyleToCss(ruledTextStyle) {
  return {
    textAlign: ruledTextStyle.horizontalAlign,
    lineHeight: `${ruledTextStyle.lineHeightMm}mm`,
    backgroundPositionY: lineVerticalAlignToBackgroundOffset(ruledTextStyle.lineVerticalAlign),
  };
}

export function gridBackgroundToCss(gridStyle) {
  const color = hexToRgb(gridStyle.color);
  const rgba = `rgba(${color.r}, ${color.g}, ${color.b}, ${gridStyle.opacity})`;

  return {
    backgroundImage: `linear-gradient(to right, ${rgba} 1px, transparent 1px), linear-gradient(to bottom, ${rgba} 1px, transparent 1px)`,
    backgroundSize: `${gridStyle.sizeMm}mm ${gridStyle.sizeMm}mm`,
  };
}

function horizontalAlignToGridValue(horizontalAlign) {
  const map = {
    left: "start",
    center: "center",
    right: "end",
  };

  return map[horizontalAlign] ?? "center";
}

function verticalAlignToGridValue(verticalAlign) {
  const map = {
    start: "start",
    middle: "center",
    end: "end",
  };

  return map[verticalAlign] ?? "center";
}

function lineVerticalAlignToBackgroundOffset(verticalAlign) {
  const map = {
    start: "0mm",
    middle: "1.7mm",
    end: "3.4mm",
  };

  return map[verticalAlign] ?? "1.7mm";
}

function hexToRgb(hex) {
  const normalized = hex.replace("#", "");
  const value = Number.parseInt(normalized.length === 3
    ? normalized.split("").map((char) => `${char}${char}`).join("")
    : normalized, 16);

  if (Number.isNaN(value)) {
    return { r: 148, g: 163, b: 184 };
  }

  return {
    r: (value >> 16) & 255,
    g: (value >> 8) & 255,
    b: value & 255,
  };
}
