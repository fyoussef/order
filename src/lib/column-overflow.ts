export const columnOverflow = (col: any[], limit: number) => {
  const colHeight = col.reduce((acc, item) => (acc += item.height), 0);
  const overflow = colHeight > limit;
  return overflow;
};
