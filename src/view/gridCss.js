export function gridBackgroundToCss(gridStyle) {
  const color = hexToRgb(gridStyle.color);
  const rgba = `rgba(${color.r}, ${color.g}, ${color.b}, ${gridStyle.opacity})`;

  return {
    backgroundImage: `linear-gradient(to right, ${rgba} 1px, transparent 1px), linear-gradient(to bottom, ${rgba} 1px, transparent 1px)`,
    backgroundSize: `${gridStyle.sizeMm}mm ${gridStyle.sizeMm}mm`,
  };
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
