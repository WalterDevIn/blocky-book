# Refactor tracker

## Estado actual

**Paso actual:** 4 — Completado. También completado después: Paso 3 — Partir `editorController.js` en acciones. Próximo paso recomendado: 5 — Convertir `blockRegistry` en registro rico.

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

**Estado:** completado.

**Motivo:** cada mutación del documento debería pasar por un wrapper único. Antes el autosave quedaba repetido manualmente después de muchas operaciones.

**Resultado:** se agregó `src/document/documentTransaction.js` con `commitDocumentChange(editorState, mutation)`. `editorController.js` ahora usa `mutateDocument(...)` para centralizar mutación + autosave y dejó de importar `saveStoredDocument` directamente.

**Archivos creados:**

```text
src/document/documentTransaction.js
```

**Archivos modificados:**

```text
src/editor/editorController.js
```

**Criterio de finalización:** cumplido. Las mutaciones del documento relevantes pasan por un wrapper único de transacción/autosave dentro del controller.

**Verificación sugerida:** crear, pegar, mover, redimensionar, borrar y editar propiedades; recargar la página y confirmar persistencia.

---

### Paso 3 — Partir `editorController.js` en acciones

**Estado:** completado.

**Motivo:** el controller coordinaba demasiadas responsabilidades: selección, clipboard, bloques, páginas, menú contextual, settings, persistencia y render.

**Resultado:** se creó `src/editor/actions/` y `editorController.js` quedó como fachada/composición de acciones.

**Archivos creados:**

```text
src/editor/actions/blockActions.js
src/editor/actions/selectionActions.js
src/editor/actions/clipboardActions.js
src/editor/actions/pageActions.js
src/editor/actions/menuActions.js
```

**Archivos modificados:**

```text
src/editor/editorController.js
```

**Criterio de finalización:** cumplido. `editorController.js` delega en módulos por responsabilidad y conserva la API pública del controller.

**Verificación sugerida:** probar selección, edición de texto, crear/borrar bloques, copiar/pegar, mover/redimensionar, cambiar tamaño de página, abrir/cerrar menú contextual y alternar grilla/margen.

---

### Paso 4 — Mover constraints de bloque fuera de `documentCommands.js`

**Estado:** completado.

**Motivo:** `documentCommands.js` no debería conocer casos particulares como que `line` tenga un mínimo especial.

**Resultado:** se creó `src/blocks/blockConstraints.js` con `getMinimumFrameSize(block)`. `documentCommands.js` ahora usa ese helper y dejó de importar `BLOCK_TYPES` para resolver constraints.

**Archivos creados:**

```text
src/blocks/blockConstraints.js
```

**Archivos modificados:**

```text
src/document/documentCommands.js
```

**Criterio de finalización:** cumplido. `documentCommands.js` ya no importa `BLOCK_TYPES` sólo para constraints.

**Verificación sugerida:** crear y redimensionar una línea; confirmar que conserva mínimo fino. Crear/redimensionar otros bloques y confirmar mínimos normales.

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
- Paso 2 completado: se agregó `documentTransaction.js` y `editorController.js` centraliza autosave con `mutateDocument(...)`.
- Paso 4 completado por pedido explícito: se movieron constraints de bloque a `src/blocks/blockConstraints.js`.
- Paso 3 completado después del Paso 4: `editorController.js` quedó compuesto por acciones bajo `src/editor/actions/`.
- Próximo paso recomendado: Paso 5 — convertir `blockRegistry` en registro rico.
