import { resetDocument } from "../core/state.js";
import { installGlobalEvents, render, renderError, setAppRoot } from "./render.js";

export function boot() {
  try {
    const appRoot = document.querySelector("#app");

    if (!appRoot) {
      throw new Error("No existe el elemento #app en index.html");
    }

    setAppRoot(appRoot);
    resetDocument();
    installGlobalEvents();
    render();
  } catch (error) {
    console.error(error);
    renderError(error);
  }
}
