let idCounter = 0;

export function createId(prefix = "id") {
  if (globalThis.crypto?.randomUUID) {
    return `${prefix}-${globalThis.crypto.randomUUID()}`;
  }

  idCounter += 1;
  return `${prefix}-${Date.now()}-${idCounter}`;
}
