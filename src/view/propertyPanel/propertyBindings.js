export function updateCommonStyle(controller, patch) {
  controller.updateSelectedBlockProps({ style: patch });
}

export function updateTextStyle(controller, patch) {
  controller.updateSelectedBlockProps({ textStyle: patch });
}

export function updateLineStyle(controller, patch) {
  controller.updateSelectedBlockProps({ line: patch });
}

export function updateRuledTextStyle(controller, patch) {
  controller.updateSelectedBlockProps({ ruledText: patch });
}

export function updateInternalGridStyle(controller, patch) {
  controller.updateSelectedBlockProps({ internalGrid: patch });
}

export function updateGridColor(controller, color) {
  controller.updateSelectedBlockProps({
    style: { borderColor: color },
    internalGrid: { color },
  });
}

export function updateImageProps(controller, patch) {
  controller.updateSelectedBlockProps({ image: patch });
}

export function updateIconProps(controller, patch) {
  controller.updateSelectedBlockProps({ icon: patch });
}
