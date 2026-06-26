import {
  getCommonStyle,
  getInternalGridStyle,
  getLineStyle,
  getRuledTextStyle,
  getTextStyle,
} from "../blocks/blockStyle.js";
import { BLOCK_TYPES } from "../blocks/blockTypes.js";
import {
  buttonGroup,
  checkboxControl,
  colorControl,
  field,
  numberControl,
  section,
  selectControl,
  textControl,
  toggleButton,
} from "./propertyControls.js";

const FONTS = [
  "Arial",
  "Georgia",
  "Times New Roman",
  "Courier New",
  "Verdana",
  "Trebuchet MS",
  "Impact",
  "Comic Sans MS",
];

const FONT_OPTIONS = FONTS.map((font) => ({ label: font, value: font }));
const HORIZONTAL_OPTIONS = [
  { label: "Izquierda", value: "left" },
  { label: "Centro", value: "center" },
  { label: "Derecha", value: "right" },
];
const VERTICAL_OPTIONS = [
  { label: "Arriba", value: "start" },
  { label: "Centro", value: "middle" },
  { label: "Abajo", value: "end" },
];

export function getBlockDisplayName(block) {
  if (block.type === BLOCK_TYPES.text) return "Texto libre";
  if (block.type === BLOCK_TYPES.line) return "Línea";
  if (block.type === BLOCK_TYPES.ruledText) return "Texto normal";
  if (block.type === BLOCK_TYPES.gridBlock) return "Cuadrícula";
  if (block.type === BLOCK_TYPES.image) return "Imagen";
  if (block.type === BLOCK_TYPES.icon) return "Ícono";
  return block.type;
}

export function renderCommonProperties({ block, controller }) {
  const style = getCommonStyle(block);

  return section("Bloque", [
    field("Fondo", colorControl({
      value: style.backgroundColor,
      onChange: (value) => updateCommonStyle(controller, { backgroundColor: value }),
    })),
    field("Texto", colorControl({
      value: style.textColor,
      onChange: (value) => updateCommonStyle(controller, { textColor: value }),
    })),
    field("Borde color", colorControl({
      value: style.borderColor ?? style.textColor,
      onChange: (value) => updateCommonStyle(controller, { borderColor: value }),
    })),
    field("Fuente", selectControl({
      value: style.fontFamily,
      options: FONT_OPTIONS,
      onChange: (value) => updateCommonStyle(controller, { fontFamily: value }),
    })),
    field("Tamaño", numberControl({
      value: style.fontSizePt,
      min: 6,
      max: 72,
      step: 1,
      onChange: (value) => updateCommonStyle(controller, { fontSizePt: value }),
    })),
    field("Borde", checkboxControl({
      checked: style.hasBorder,
      onChange: (value) => updateCommonStyle(controller, { hasBorder: value }),
    })),
    field("Radio", numberControl({
      value: style.borderRadiusMm,
      min: 0,
      max: 20,
      step: 0.5,
      onChange: (value) => updateCommonStyle(controller, { borderRadiusMm: value }),
    })),
    field("Layer", numberControl({
      value: style.layer,
      min: 0,
      max: 999,
      step: 1,
      onChange: (value) => updateCommonStyle(controller, { layer: value }),
    })),
    field("Estilo", buttonGroup([
      toggleButton({
        label: "B",
        active: style.bold,
        title: "Negrita",
        onClick: () => updateCommonStyle(controller, { bold: !style.bold }),
      }),
      toggleButton({
        label: "I",
        active: style.italic,
        title: "Cursiva",
        onClick: () => updateCommonStyle(controller, { italic: !style.italic }),
      }),
      toggleButton({
        label: "S",
        active: style.strike,
        title: "Tachado",
        onClick: () => updateCommonStyle(controller, { strike: !style.strike }),
      }),
    ])),
  ]);
}

export function renderSpecificProperties({ block, controller }) {
  if (block.type === BLOCK_TYPES.text) return renderTextProperties({ block, controller });
  if (block.type === BLOCK_TYPES.line) return renderLineProperties({ block, controller });
  if (block.type === BLOCK_TYPES.ruledText) return renderRuledTextProperties({ block, controller });
  if (block.type === BLOCK_TYPES.gridBlock) {
    return [renderRuledTextProperties({ block, controller }), renderInternalGridProperties({ block, controller })];
  }
  if (block.type === BLOCK_TYPES.image) return renderImageProperties({ block, controller });
  if (block.type === BLOCK_TYPES.icon) return renderIconProperties({ block, controller });
  return null;
}

function renderTextProperties({ block, controller }) {
  const textStyle = getTextStyle(block);

  return section("Texto", [
    field("Horizontal", selectControl({
      value: textStyle.horizontalAlign,
      options: HORIZONTAL_OPTIONS,
      onChange: (value) => updateTextStyle(controller, { horizontalAlign: value }),
    })),
    field("Vertical", selectControl({
      value: textStyle.verticalAlign,
      options: VERTICAL_OPTIONS,
      onChange: (value) => updateTextStyle(controller, { verticalAlign: value }),
    })),
    field("Relleno", numberControl({
      value: textStyle.paddingMm,
      min: 0,
      max: 20,
      step: 0.5,
      onChange: (value) => updateTextStyle(controller, { paddingMm: value }),
    })),
  ]);
}

function renderLineProperties({ block, controller }) {
  const lineStyle = getLineStyle(block);

  return section("Línea", [
    field("Ángulo", selectControl({
      value: String(lineStyle.angleDeg),
      options: [
        { label: "0°", value: "0" },
        { label: "45°", value: "45" },
        { label: "90°", value: "90" },
      ],
      onChange: (value) => updateLineStyle(controller, { angleDeg: Number(value) }),
    })),
    field("Grosor", numberControl({
      value: lineStyle.thicknessMm,
      min: 0.25,
      max: 5,
      step: 0.25,
      onChange: (value) => updateLineStyle(controller, { thicknessMm: value }),
    })),
  ]);
}

function renderRuledTextProperties({ block, controller }) {
  const ruledTextStyle = getRuledTextStyle(block);

  return section("Texto normal", [
    field("Horizontal", selectControl({
      value: ruledTextStyle.horizontalAlign,
      options: HORIZONTAL_OPTIONS,
      onChange: (value) => updateRuledTextStyle(controller, { horizontalAlign: value }),
    })),
    field("Vertical línea", selectControl({
      value: ruledTextStyle.lineVerticalAlign,
      options: VERTICAL_OPTIONS,
      onChange: (value) => updateRuledTextStyle(controller, { lineVerticalAlign: value }),
    })),
    field("Relleno", numberControl({
      value: ruledTextStyle.paddingMm,
      min: 0,
      max: 20,
      step: 0.5,
      onChange: (value) => updateRuledTextStyle(controller, { paddingMm: value }),
    })),
    field("Mostrar líneas", checkboxControl({
      checked: ruledTextStyle.showLines,
      onChange: (value) => updateRuledTextStyle(controller, { showLines: value }),
    })),
    field("Color líneas", colorControl({
      value: ruledTextStyle.lineColor,
      onChange: (value) => updateRuledTextStyle(controller, { lineColor: value }),
    })),
    field("Opacidad líneas", numberControl({
      value: ruledTextStyle.lineOpacity,
      min: 0,
      max: 1,
      step: 0.05,
      onChange: (value) => updateRuledTextStyle(controller, { lineOpacity: value }),
    })),
  ]);
}

function renderInternalGridProperties({ block, controller }) {
  const gridStyle = getInternalGridStyle(block);

  return section("Cuadrícula interna", [
    field("Color", colorControl({
      value: gridStyle.color,
      onChange: (value) => updateGridColor(controller, value),
    })),
    field("Opacidad", numberControl({
      value: gridStyle.opacity,
      min: 0,
      max: 1,
      step: 0.05,
      onChange: (value) => updateInternalGridStyle(controller, { opacity: value }),
    })),
  ]);
}

function renderImageProperties({ block, controller }) {
  const image = { src: "", alt: "Imagen", objectFit: "contain", ...block.props.image };

  return section("Imagen", [
    field("URL", textControl({
      value: image.src,
      placeholder: "https://...",
      onChange: (value) => updateImageProps(controller, { src: value }),
    })),
    field("Alt", textControl({
      value: image.alt,
      placeholder: "Descripción",
      onChange: (value) => updateImageProps(controller, { alt: value }),
    })),
    field("Ajuste", selectControl({
      value: image.objectFit,
      options: [
        { label: "Contener", value: "contain" },
        { label: "Cubrir", value: "cover" },
        { label: "Estirar", value: "fill" },
      ],
      onChange: (value) => updateImageProps(controller, { objectFit: value }),
    })),
  ]);
}

function renderIconProperties({ block, controller }) {
  const icon = { className: "fa-solid fa-star", ...block.props.icon };

  return section("Ícono", [
    field("Clase", textControl({
      value: icon.className,
      placeholder: "fa-solid fa-star",
      onChange: (value) => updateIconProps(controller, { className: value }),
    })),
  ]);
}

function updateCommonStyle(controller, patch) {
  controller.updateSelectedBlockProps({ style: patch });
}

function updateTextStyle(controller, patch) {
  controller.updateSelectedBlockProps({ textStyle: patch });
}

function updateLineStyle(controller, patch) {
  controller.updateSelectedBlockProps({ line: patch });
}

function updateRuledTextStyle(controller, patch) {
  controller.updateSelectedBlockProps({ ruledText: patch });
}

function updateInternalGridStyle(controller, patch) {
  controller.updateSelectedBlockProps({ internalGrid: patch });
}

function updateGridColor(controller, color) {
  controller.updateSelectedBlockProps({
    style: { borderColor: color },
    internalGrid: { color },
  });
}

function updateImageProps(controller, patch) {
  controller.updateSelectedBlockProps({ image: patch });
}

function updateIconProps(controller, patch) {
  controller.updateSelectedBlockProps({ icon: patch });
}
