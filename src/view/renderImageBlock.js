import { getCommonStyle } from "../blocks/blockStyle.js";
import { el } from "../shared/dom.js";
import { createBlockElement } from "./blockChrome.js";

export function renderImageBlock({ block, page, pageElement, editorState, controller }) {
  const commonStyle = getCommonStyle(block);
  const image = getImageProps(block);
  const content = image.src
    ? renderImageContent(image)
    : el("div", {
      className: "block__image-placeholder",
      textContent: "Imagen vacía",
    });

  return createBlockElement({
    block,
    page,
    pageElement,
    editorState,
    controller,
    commonStyle,
    children: [content],
  });
}

function renderImageContent(image) {
  const children = [
    el("img", {
      className: "block__image",
      attrs: {
        src: image.src,
        alt: image.alt,
      },
      style: {
        objectFit: image.objectFit,
      },
    }),
  ];

  if (image.gradientEnabled && image.gradientCss.trim()) {
    children.push(el("div", {
      className: "block__image-gradient",
      style: {
        backgroundImage: image.gradientCss,
      },
    }));
  }

  return el("div", { className: "block__image-frame" }, children);
}

function getImageProps(block) {
  return {
    src: "",
    alt: "Imagen",
    objectFit: "contain",
    gradientEnabled: false,
    gradientCss: "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.55) 100%)",
    ...block.props.image,
  };
}
