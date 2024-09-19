export const findColumnIdx = (columns: any[][], id: string) => {
  for (const col in columns) {
    const inThisColumn = (columns[col] as any[]).some((slot) => slot.id == id);
    if (inThisColumn) return Number(col);
  }
};
