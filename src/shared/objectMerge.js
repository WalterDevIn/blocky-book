export function mergePlainObjects(base, patch) {
  const result = { ...base };

  Object.entries(patch ?? {}).forEach(([key, value]) => {
    const currentValue = result[key];

    if (isPlainObject(currentValue) && isPlainObject(value)) {
      result[key] = mergePlainObjects(currentValue, value);
      return;
    }

    result[key] = value;
  });

  return result;
}

function isPlainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
