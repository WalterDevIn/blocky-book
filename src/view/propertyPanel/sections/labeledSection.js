import {
  field,
  numberControl,
  section,
  selectControl,
  textControl,
} from "../../propertyControls.js";
import { updateLabeledStyle } from "../propertyBindings.js";

const LABEL_POSITION_OPTIONS = [
  { value: "placeholder", label: "Placeholder" },
  { value: "fieldsetTopLeft", label: "Fieldset arriba izquierda" },
  { value: "fieldsetTopCenter", label: "Fieldset arriba centro" },
  { value: "fieldsetTopRight", label: "Fieldset arriba derecha" },
  { value: "insideTopLeft", label: "Dentro arriba izquierda" },
  { value: "insideTopRight", label: "Dentro arriba derecha" },
  { value: "outsideTopLeft", label: "Fuera arriba izquierda" },
];

export function renderLabeledSection({ block, controller }) {
  const label = {
    text: block.props.label?.text ?? "Etiqueta",
    position: block.props.label?.position ?? "fieldsetTopLeft",
    fontSizePt: block.props.label?.fontSizePt ?? 8,
  };

  return section("Etiqueta", [
    field("Texto", textControl({
      value: label.text,
      placeholder: "Etiqueta",
      onChange: (value) => updateLabeledStyle(controller, { text: value }),
    })),
    field("Posición", selectControl({
      value: label.position,
      options: LABEL_POSITION_OPTIONS,
      onChange: (value) => updateLabeledStyle(controller, { position: value }),
    })),
    field("Tamaño", numberControl({
      value: label.fontSizePt,
      min: 4,
      max: 32,
      step: 1,
      onChange: (value) => updateLabeledStyle(controller, { fontSizePt: value }),
    })),
  ]);
}
