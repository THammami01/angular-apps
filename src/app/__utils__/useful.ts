export const flattenObject = (obj: {}) => {
  return Object.values(obj)
    .map((el) => String(el))
    .join(' ');
};
