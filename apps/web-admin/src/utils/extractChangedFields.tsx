export const extractChangedFields = <T extends Record<string, any>>(
  oldData: Partial<T>,
  newData: T
): Partial<T> => {
  const changed: Partial<T> = {};

  for (const key in newData) {
    if (newData[key] !== oldData[key]) {
      changed[key] = newData[key];
    }
  }

  return changed;
};
