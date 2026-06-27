import { getCommonStyle } from "../../../blocks/blockStyle.js";
import {
  checkboxControl,
  field,
  numberControl,
  section,
} from "../../propertyControls.js";
import { colorReferenceControl } from "../colorReferenceControl.js";
import { updateCommonStyle } from "../propertyBindings.js";

export function renderAppearanceSection({ block, editorState, controller }) {
  const style = getCommonStyle(block);

  return section("Apariencia", [
    field("Snap 2.5mm", checkboxControl({
      checked: style.useFineSnap,
      onChange: (value) => updateCommonStyle(controller, { useFineSnap: value }),
    })),
    field("Fondo", colorReferenceControl({
      label: "Fondo",
      globalColors: editorState.globalColors,
      colorId: style.backgroundColorId,
      color: style.backgroundColor,
      opacity: style.backgroundOpacity,
      onGlobalChange: (value) => updateCommonStyle(controller, { backgroundColorId: value }),
      onColorChange: (value) => updateCommonStyle(controller, { backgroundColor: value, backgroundColorId: "" }),
      onOpacityChange: (value) => updateCommonStyle(controller, { backgroundOpacity: value, backgroundColorId: "" }),
    }), { className: "property-field--color" }),
    field("Texto", colorReferenceControl({
      label: "Texto",
      globalColors: editorState.globalColors,
      colorId: style.textColorId,
      color: style.textColor,
      opacity: style.textOpacity,
      onGlobalChange: (value) => updateCommonStyle(controller, { textColorId: value }),
      onColorChange: (value) => updateCommonStyle(controller, { textColor: value, textColorId: "" }),
      onOpacityChange: (value) => updateCommonStyle(controller, { textOpacity: value, textColorId: "" }),
    }), { className: "property-field--color" }),
    field("Borde", colorReferenceControl({
      label: "Borde",
      globalColors: editorState.globalColors,
      colorId: style.borderColorId,
      color: style.borderColor ?? style.textColor,
      opacity: style.borderOpacity,
      onGlobalChange: (value) => updateCommonStyle(controller, { borderColorId: value }),
      onColorChange: (value) => updateCommonStyle(controller, { borderColor: value, borderColorId: "" }),
      onOpacityChange: (value) => updateCommonStyle(controller, { borderOpacity: value, borderColorId: "" }),
    }), { className: "property-field--color" }),
    field("Borde visible", checkboxControl({
      checked: style.hasBorder,
      onChange: (value) => updateCommonStyle(controller, { hasBorder: value }),
    })),
    field("Bordes avanzados", checkboxControl({
      checked: style.useAdvancedBorder,
      onChange: (value) => updateCommonStyle(controller, { useAdvancedBorder: value }),
    })),
    ...renderBorderModeFields({ style, controller }),
    field("Layer", numberControl({
      value: style.layer,
      min: 0,
      max: 999,
      step: 1,
      onChange: (value) => updateCommonStyle(controller, { layer: value }),
    })),
  ]);
}

function renderBorderModeFields({ style, controller }) {
  if (!style.useAdvancedBorder) {
    return [
      renderSideNumberField("Grosor borde", style.borderWidthMm, "borderWidthMm", controller),
      renderSideNumberField("Radio borde", style.borderRadiusMm, "borderRadiusMm", controller),
    ];
  }

  return [
    renderSideNumberField("Borde sup.", style.borderTopWidthMm, "borderTopWidthMm", controller),
    renderSideNumberField("Borde der.", style.borderRightWidthMm, "borderRightWidthMm", controller),
    renderSideNumberField("Borde inf.", style.borderBottomWidthMm, "borderBottomWidthMm", controller),
    renderSideNumberField("Borde izq.", style.borderLeftWidthMm, "borderLeftWidthMm", controller),
    renderSideNumberField("Radio sup. izq.", style.borderTopLeftRadiusMm ?? style.borderRadiusMm, "borderTopLeftRadiusMm", controller),
    renderSideNumberField("Radio sup. der.", style.borderTopRightRadiusMm ?? style.borderRadiusMm, "borderTopRightRadiusMm", controller),
    renderSideNumberField("Radio inf. der.", style.borderBottomRightRadiusMm ?? style.borderRadiusMm, "borderBottomRightRadiusMm", controller),
    renderSideNumberField("Radio inf. izq.", style.borderBottomLeftRadiusMm ?? style.borderRadiusMm, "borderBottomLeftRadiusMm", controller),
  ];
}

function renderSideNumberField(label, value, key, controller) {
  return field(label, numberControl({
    value,
    min: 0,
    max: 20,
    step: 0.25,
    onChange: (nextValue) => updateCommonStyle(controller, { [key]: nextValue }),
  }));
}
