import { getCommonStyle } from "../../../blocks/blockStyle.js";
import {
  buttonGroup,
  checkboxControl,
  colorOpacityControl,
  field,
  numberControl,
  section,
  selectControl,
  textControl,
  toggleButton,
} from "../../propertyControls.js";
import { updateCommonStyle } from "../propertyBindings.js";

export function renderAppearanceSection({ block, editorState, controller }) {
  const style = getCommonStyle(block);

  return section("Apariencia", [
    renderGlobalColorManager({ editorState, controller }),
    renderColorSlot({
      label: "Fondo",
      globalColors: editorState.globalColors,
      colorId: style.backgroundColorId,
      color: style.backgroundColor,
      opacity: style.backgroundOpacity,
      onGlobalChange: (value) => updateCommonStyle(controller, { backgroundColorId: value }),
      onColorChange: (value) => updateCommonStyle(controller, { backgroundColor: value, backgroundColorId: "" }),
      onOpacityChange: (value) => updateCommonStyle(controller, { backgroundOpacity: value, backgroundColorId: "" }),
    }),
    renderColorSlot({
      label: "Texto",
      globalColors: editorState.globalColors,
      colorId: style.textColorId,
      color: style.textColor,
      opacity: style.textOpacity,
      onGlobalChange: (value) => updateCommonStyle(controller, { textColorId: value }),
      onColorChange: (value) => updateCommonStyle(controller, { textColor: value, textColorId: "" }),
      onOpacityChange: (value) => updateCommonStyle(controller, { textOpacity: value, textColorId: "" }),
    }),
    renderColorSlot({
      label: "Borde",
      globalColors: editorState.globalColors,
      colorId: style.borderColorId,
      color: style.borderColor ?? style.textColor,
      opacity: style.borderOpacity,
      onGlobalChange: (value) => updateCommonStyle(controller, { borderColorId: value }),
      onColorChange: (value) => updateCommonStyle(controller, { borderColor: value, borderColorId: "" }),
      onOpacityChange: (value) => updateCommonStyle(controller, { borderOpacity: value, borderColorId: "" }),
    }),
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

function renderColorSlot({ label, globalColors, colorId, color, opacity, onGlobalChange, onColorChange, onOpacityChange }) {
  return [
    field(`${label} global`, selectControl({
      value: colorId || "",
      options: [
        { value: "", label: "Local" },
        ...globalColors.map((globalColor) => ({
          value: globalColor.id,
          label: `${globalColor.name} (${globalColor.hex}, α ${globalColor.opacity})`,
        })),
      ],
      onChange: onGlobalChange,
    })),
    field(label, colorOpacityControl({
      color,
      opacity,
      onColorChange,
      onOpacityChange,
    }), { className: "property-field--color" }),
  ];
}

function renderGlobalColorManager({ editorState, controller }) {
  return section("Colores globales", [
    buttonGroup([
      toggleButton({
        label: "+ Color",
        title: "Crear color global",
        active: false,
        onClick: () => controller.addGlobalColor(),
      }),
    ]),
    ...editorState.globalColors.flatMap((color) => [
      field("Nombre", textControl({
        value: color.name,
        placeholder: "Nombre",
        onChange: (value) => controller.updateGlobalColor(color.id, { name: value }),
      })),
      field("Hex/α", colorOpacityControl({
        color: color.hex,
        opacity: color.opacity,
        onColorChange: (value) => controller.updateGlobalColor(color.id, { hex: value }),
        onOpacityChange: (value) => controller.updateGlobalColor(color.id, { opacity: value }),
      }), { className: "property-field--color" }),
      field("Eliminar", buttonGroup([
        toggleButton({
          label: "Borrar",
          title: "Eliminar color global",
          active: false,
          onClick: () => controller.deleteGlobalColor(color.id),
        }),
      ])),
    ]),
  ]);
}
