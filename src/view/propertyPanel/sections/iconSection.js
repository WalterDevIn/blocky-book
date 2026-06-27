import { field, section, textControl } from "../../propertyControls.js";
import { updateIconProps } from "../propertyBindings.js";

export function renderIconSection({ block, controller }) {
  const icon = { className: "fa-solid fa-star", ...block.props.icon };

  return section("Ícono", [
    field("Clase", textControl({
      value: icon.className,
      placeholder: "fa-solid fa-star",
      onChange: (value) => updateIconProps(controller, { className: value }),
    })),
  ]);
}
