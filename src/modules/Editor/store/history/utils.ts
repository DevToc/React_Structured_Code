export const isEmpty = (value: any): boolean => {
  return (
    value === null ||
    value === undefined ||
    (typeof value === 'object' && !Object.values(value).some((v) => v !== null && typeof v !== 'undefined')) ||
    (typeof value === 'string' && value.length === 0)
  );
};

export const isNotEmpty = (value: any) => !isEmpty(value);
