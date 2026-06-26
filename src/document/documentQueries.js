export function findPageById(documentModel, pageId) {
  for (const spread of documentModel.spreads) {
    const page = spread.pages.find((candidate) => candidate.id === pageId);
    if (page) return { spread, page };
  }

  return null;
}

export function findBlockById(documentModel, blockId) {
  for (const spread of documentModel.spreads) {
    for (const page of spread.pages) {
      const block = page.blocks.find((candidate) => candidate.id === blockId);
      if (block) return { spread, page, block };
    }
  }

  return null;
}

export function getFirstPage(documentModel) {
  return documentModel.spreads[0]?.pages[0] ?? null;
}

export function getAllPages(documentModel) {
  return documentModel.spreads.flatMap((spread) => spread.pages);
}
