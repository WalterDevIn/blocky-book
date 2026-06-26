export function readEditedText(blockId) {
  return document.querySelector(`[data-editable-id="${blockId}"]`)?.innerText;
}

export function focusEditable(blockId) {
  requestAnimationFrame(() => {
    const editable = document.querySelector(`[data-editable-id="${blockId}"]`);
    if (!editable) return;

    editable.focus();
    const range = document.createRange();
    range.selectNodeContents(editable);
    range.collapse(false);

    const selection = document.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  });
}
