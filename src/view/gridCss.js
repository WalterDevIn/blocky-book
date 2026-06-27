export function gridBackgroundToCss(gridStyle) {
  const rgba = colorToRgba(gridStyle.color, gridStyle.opacity);

  return {
    backgroundImage: `linear-gradient(to right, ${rgba} 1px, transparent 1px), linear-gradient(to bottom, ${rgba} 1px, transparent 1px)`,
    backgroundSize: `${gridStyle.sizeMm}mm ${gridStyle.sizeMm}mm`,
    backgroundPosition: "-1px -1px",
  };
}

export function lineBackgroundToCss(ruledTextStyle) {
  if (!ruledTextStyle.showLines) {
    return {
      backgroundImage: "none",
      backgroundSize: "auto",
    };
  }

  const rgba = colorToRgba(ruledTextStyle.lineColor, ruledTextStyle.lineOpacity);

  return {
    backgroundImage: `repeating-linear-gradient(to bottom, transparent 0, transparent calc(5mm - 1px), ${rgba} calc(5mm - 1px), ${rgba} 5mm)`,
    backgroundSize: "100% 5mm",
  };
}

function colorToRgba(hex, opacity) {
  const color = hexToRgb(hex);
  return `rgba(${color.r}, ${color.g}, ${color.b}, ${opacity})`;
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
