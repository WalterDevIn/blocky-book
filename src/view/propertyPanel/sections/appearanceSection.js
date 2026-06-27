import { getCommonStyle } from "../../../blocks/blockStyle.js";
import {
  checkboxControl,
  colorOpacityControl,
  field,
  numberControl,
  section,
} from "../../propertyControls.js";
import { updateCommonStyle } from "../propertyBindings.js";

export function renderAppearanceSection({ block, controller }) {
  const style = getCommonStyle(block);

  return section("Apariencia", [
    field("Fondo", colorOpacityControl({
      color: style.backgroundColor,
      opacity: style.backgroundOpacity,
      onColorChange: (value) => updateCommonStyle(controller, { backgroundColor: value }),
      onOpacityChange: (value) => updateCommonStyle(controller, { backgroundOpacity: value }),
    }), { className: "property-field--color" }),
    field("Texto", colorOpacityControl({
      color: style.textColor,
      opacity: style.textOpacity,
      onColorChange: (value) => updateCommonStyle(controller, { textColor: value }),
      onOpacityChange: (value) => updateCommonStyle(controller, { textOpacity: value }),
    }), { className: "property-field--color" }),
    field("Borde", colorOpacityControl({
      color: style.borderColor ?? style.textColor,
      opacity: style.borderOpacity,
      onColorChange: (value) => updateCommonStyle(controller, { borderColor: value }),
      onOpacityChange: (value) => updateCommonStyle(controller, { borderOpacity: value }),
    }), { className: "property-field--color" }),
    field("Borde visible", checkboxControl({
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
  ]);
}
