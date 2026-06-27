import { getCommonStyle } from "../../../blocks/blockStyle.js";
import {
  buttonGroup,
  field,
  numberControl,
  section,
  selectControl,
  toggleButton,
} from "../../propertyControls.js";
import { FONT_OPTIONS } from "../propertyOptions.js";
import { updateCommonStyle } from "../propertyBindings.js";

export function renderTypographySection({ block, controller }) {
  const style = getCommonStyle(block);

  return section("Tipografía", [
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
