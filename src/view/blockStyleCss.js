import { lineBackgroundToCss } from "./gridCss.js";

export function commonStyleToCss(commonStyle, globalColors = []) {
  const background = resolveColorToken({
    colorId: commonStyle.backgroundColorId,
    fallbackColor: commonStyle.backgroundColor,
    fallbackOpacity: commonStyle.backgroundOpacity,
    globalColors,
  });
  const text = resolveColorToken({
    colorId: commonStyle.textColorId,
    fallbackColor: commonStyle.textColor,
    fallbackOpacity: commonStyle.textOpacity,
    globalColors,
  });
  const border = resolveColorToken({
    colorId: commonStyle.borderColorId,
    fallbackColor: commonStyle.borderColor,
    fallbackOpacity: commonStyle.borderOpacity,
    globalColors,
  });
  const radius = commonStyle.borderRadiusMm;
  const borderWidths = commonStyle.useAdvancedBorder
    ? {
      borderTopWidth: `${commonStyle.borderTopWidthMm}mm`,
      borderRightWidth: `${commonStyle.borderRightWidthMm}mm`,
      borderBottomWidth: `${commonStyle.borderBottomWidthMm}mm`,
      borderLeftWidth: `${commonStyle.borderLeftWidthMm}mm`,
    }
    : { borderWidth: `${commonStyle.borderWidthMm}mm` };
  const borderRadii = commonStyle.useAdvancedBorder
    ? {
      borderTopLeftRadius: `${commonStyle.borderTopLeftRadiusMm ?? radius}mm`,
      borderTopRightRadius: `${commonStyle.borderTopRightRadiusMm ?? radius}mm`,
      borderBottomRightRadius: `${commonStyle.borderBottomRightRadiusMm ?? radius}mm`,
      borderBottomLeftRadius: `${commonStyle.borderBottomLeftRadiusMm ?? radius}mm`,
    }
    : { borderRadius: `${radius}mm` };

  return {
    zIndex: String(commonStyle.layer),
    color: colorWithOpacity(text.hex, text.opacity),
    backgroundColor: colorWithOpacity(background.hex, background.opacity),
    borderColor: colorWithOpacity(border.hex, border.opacity),
    borderStyle: commonStyle.hasBorder ? "solid" : "none",
    ...borderWidths,
    ...borderRadii,
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
    ...lineBackgroundToCss(ruledTextStyle),
  };
}

export function ruledTextStyleToCss(ruledTextStyle) {
  return {
    textAlign: ruledTextStyle.horizontalAlign,
    lineHeight: `${ruledTextStyle.lineHeightMm}mm`,
    transform: `translateY(${lineVerticalAlignToTextOffset(ruledTextStyle.lineVerticalAlign)})`,
  };
}

function resolveColorToken({ colorId, fallbackColor, fallbackOpacity, globalColors }) {
  const globalColor = globalColors.find((color) => color.id === colorId);
  if (globalColor) {
    return {
      hex: globalColor.hex,
      opacity: globalColor.opacity,
    };
  }

  return {
    hex: fallbackColor,
    opacity: fallbackOpacity,
  };
}

function colorWithOpacity(hex, opacity) {
  const color = hexToRgb(hex);
  return `rgba(${color.r}, ${color.g}, ${color.b}, ${opacity})`;
}

function hexToRgb(hex) {
  const normalized = String(hex ?? "").replace("#", "");
  const value = Number.parseInt(normalized.length === 3
    ? normalized.split("").map((char) => `${char}${char}`).join("")
    : normalized, 16);

  if (Number.isNaN(value)) return { r: 31, g: 35, b: 40 };

  return {
    r: (value >> 16) & 255,
    g: (value >> 8) & 255,
    b: value & 255,
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

function lineVerticalAlignToTextOffset(verticalAlign) {
  const map = {
    start: "-0.7mm",
    middle: "0mm",
    end: "0.7mm",
  };

  return map[verticalAlign] ?? "0mm";
}
