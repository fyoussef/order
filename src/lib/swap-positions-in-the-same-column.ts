import { arrayMove } from "@dnd-kit/sortable";

type Params = {
  columns: any[][];
  columnIdx: number;
  itemId: number;
  overItemId: number;
};

export const swapPositionsInTheSameColumn = ({
  columnIdx,
  columns,
  itemId,
  overItemId,
}: Params) => {
  const oldIdx = columns[columnIdx].findIndex((slot) => slot.id == itemId);
  const newIdx = columns[columnIdx].findIndex((slot) => slot.id == overItemId);
  const firstColumns = columns.slice(0, columnIdx);
  const newColumn = [arrayMove(columns[columnIdx] as any, oldIdx, newIdx)];
  const lastColumns = columns.slice(Number(columnIdx) + 1, columns.length);
  return [...firstColumns, ...newColumn, ...lastColumns];
};
