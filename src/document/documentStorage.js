const STORAGE_KEY = "mini-rpg-printer.document.v1";

export function loadStoredDocument() {
  try {
    const rawDocument = window.localStorage.getItem(STORAGE_KEY);
    if (!rawDocument) return null;
    return JSON.parse(rawDocument);
  } catch {
    return null;
  }
}

export function saveStoredDocument(documentModel) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(documentModel));
  } catch {
    // localStorage can be unavailable or full; autosave is best-effort.
  }
}
