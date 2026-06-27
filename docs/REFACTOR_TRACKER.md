# Refactor tracker

## Estado actual

**Paso actual:** 1 — Completado. Próximo paso: 2 — Extraer transacción/autosave del controller.

**Regla de trabajo:** no avanzar al siguiente paso sin actualizar este archivo. Cada refactor debe mantener el estado actual, los archivos tocados y una nota breve de verificación.

## Objetivo

Reducir responsabilidades mal distribuidas y archivos dios sin romper la app. El refactor debe hacerse de forma incremental, con pasos pequeños y verificables.

## Orden de refactor recomendado

### Paso 1 — Extraer `blockPropertySections.js` por secciones

**Estado:** completado.

**Motivo:** es el refactor más rentable. Baja complejidad visual y facilita seguir agregando componentes.

**Resultado:** `blockPropertySections.js` quedó como fachada fina. Las secciones y helpers del inspector viven bajo `src/view/propertyPanel/`.

**Archivos creados:**

```text
src/view/propertyPanel/blockDisplayName.js
src/view/propertyPanel/propertyBindings.js
src/view/propertyPanel/propertyOptions.js
src/view/propertyPanel/renderSpecificProperties.js
src/view/propertyPanel/sections/appearanceSection.js
src/view/propertyPanel/sections/typographySection.js
src/view/propertyPanel/sections/textSection.js
src/view/propertyPanel/sections/ruledTextSection.js
src/view/propertyPanel/sections/lineSection.js
src/view/propertyPanel/sections/gridSection.js
src/view/propertyPanel/sections/imageSection.js
src/view/propertyPanel/sections/iconSection.js
```

**Archivos modificados:**

```text
src/view/blockPropertySections.js
```

**Criterio de finalización:** cumplido. `blockPropertySections.js` dejó de contener todas las secciones específicas y ahora reexporta piezas del nuevo panel.

**Verificación sugerida:** abrir menú contextual de cada tipo de bloque y confirmar que aparecen las mismas secciones y que los cambios se aplican.

---

### Paso 2 — Extraer transacción/autosave del controller

**Estado:** pendiente.

**Motivo:** cada mutación del documento debería pasar por un wrapper único. Hoy el autosave queda repetido manualmente después de muchas operaciones.

**Idea objetivo:**

```text
src/document/documentTransaction.js
```

Con una función similar a:

```js
commitDocumentChange(editorState, render, mutation)
```

**Criterio de finalización:** las mutaciones del documento guardan automáticamente sin repetir `saveDocument()` en cada acción.

---

### Paso 3 — Partir `editorController.js` en acciones

**Estado:** pendiente.

**Motivo:** el controller coordina demasiadas responsabilidades: selección, clipboard, bloques, páginas, menú contextual, settings, persistencia y render.

**Idea objetivo:**

```text
src/editor/actions/
  blockActions.js
  selectionActions.js
  clipboardActions.js
  pageActions.js
  menuActions.js
```

`createEditorController` debería quedar como fachada/composición.

**Criterio de finalización:** `editorController.js` queda pequeño y delega en módulos por responsabilidad.

---

### Paso 4 — Mover constraints de bloque fuera de `documentCommands.js`

**Estado:** pendiente.

**Motivo:** `documentCommands.js` no debería conocer casos particulares como que `line` tenga un mínimo especial.

**Idea objetivo:**

```text
src/blocks/blockConstraints.js
```

O incluir constraints en cada definición de bloque:

```js
constraints: {
  minFrame: { widthMm: 5, heightMm: 0.5 }
}
```

**Criterio de finalización:** `documentCommands.js` no importa `BLOCK_TYPES` sólo para constraints.

---

### Paso 5 — Convertir `blockRegistry` en registro rico

**Estado:** pendiente.

**Motivo:** agregar un bloque exige tocar demasiados archivos: tipo, registro, toolbar, dispatcher de render, inspector, capabilities, constraints. El registry debería centralizar metadata.

**Idea objetivo:** cada definición de bloque debería poder exponer:

```text
label
iconClass
render
propertySection
capabilities
constraints
```

**Criterio de finalización:** toolbar, render dispatcher e inspector reducen hardcodeos por tipo.

---

### Paso 6 — Partir `blockDragSession.js` en intent, preview y commit

**Estado:** pendiente.

**Motivo:** la sesión de drag mezcla pointer events, click vs drag, edición de texto, selección múltiple, ghost visual, preview grupal y commit final.

**Idea objetivo:**

```text
src/editor/interaction/
  blockDragSession.js
  dragIntent.js
  blockDragPreview.js
  dropCommit.js
  textEditGesture.js
```

**Criterio de finalización:** `blockDragSession.js` conserva el ciclo de eventos, pero delega reglas y efectos visuales.

---

### Paso 7 — Sacar handlers de página de `renderCanvas.js`

**Estado:** pendiente.

**Motivo:** `renderCanvas.js` debería renderizar canvas/páginas, no decidir políticas de interacción como selección rectangular, limpiar selección o menú contextual.

**Idea objetivo:**

```text
src/editor/interaction/pagePointerHandlers.js
```

**Criterio de finalización:** `renderCanvas.js` compone handlers importados, sin lógica directa de interacción.

---

## Estructura objetivo moderada

```text
src/
  app/
  document/
    documentFactory.js
    documentQueries.js
    documentCommands.js
    documentStorage.js
    documentTransaction.js

  blocks/
    blockRegistry.js
    blockTypes.js
    blockConstraints.js
    definitions/
      textBlockDefinition.js
      lineBlockDefinition.js
      imageBlockDefinition.js
      iconBlockDefinition.js
    style/
      commonStyle.js
      textStyle.js
      gridStyle.js

  editor/
    editorState.js
    controllers/
      createEditorController.js
      blockActions.js
      selectionActions.js
      clipboardActions.js
      pageActions.js
      menuActions.js
    interaction/
      blockDragSession.js
      blockDragPreview.js
      dragIntent.js
      dropCommit.js
      marqueeSelectionSession.js
      pagePointerHandlers.js

  view/
    renderCanvas.js
    renderToolbar.js
    renderBlock.js
    renderers/
      renderTextBlock.js
      renderImageBlock.js
      renderIconBlock.js
    propertyPanel/
      renderPropertyPanel.js
      controls.js
      sections/
        appearanceSection.js
        typographySection.js
        imageSection.js
        lineSection.js
```

## Historial de avance

### 2026-06-26

- Paso 0 creado.
- Plan registrado en `docs/REFACTOR_TRACKER.md`.
- No se inició el Paso 1.
- Paso 1 completado: `blockPropertySections.js` se extrajo por secciones bajo `src/view/propertyPanel/`.
- Próximo paso: Paso 2 — extraer transacción/autosave del controller.
