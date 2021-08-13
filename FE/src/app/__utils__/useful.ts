export const flattenObject = (obj: {}) => {
  return Object.values(obj)
    .map((el) => String(el))
    .join(' ');
};

export const changeMySQLDate = (date: string) => {
  return date?.split('T')[0].split('-').reverse().join('/');
};
