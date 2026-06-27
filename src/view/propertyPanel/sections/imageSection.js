import {
  checkboxControl,
  field,
  section,
  selectControl,
  textControl,
} from "../../propertyControls.js";
import { IMAGE_FIT_OPTIONS } from "../propertyOptions.js";
import { updateImageProps } from "../propertyBindings.js";

const DEFAULT_IMAGE_PROPS = {
  src: "",
  alt: "Imagen",
  objectFit: "contain",
  gradientEnabled: false,
  gradientCss: "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.55) 100%)",
};

export function renderImageSection({ block, controller }) {
  const image = {
    ...DEFAULT_IMAGE_PROPS,
    ...block.props.image,
  };

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
      options: IMAGE_FIT_OPTIONS,
      onChange: (value) => updateImageProps(controller, { objectFit: value }),
    })),
    field("Gradient", checkboxControl({
      checked: image.gradientEnabled,
      onChange: (value) => updateImageProps(controller, { gradientEnabled: value }),
    })),
    field("Linear gradient", textControl({
      value: image.gradientCss,
      placeholder: "linear-gradient(...)  ",
      onChange: (value) => updateImageProps(controller, { gradientCss: value }),
    })),
  ]);
}
