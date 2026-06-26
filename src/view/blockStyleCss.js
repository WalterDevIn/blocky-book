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
