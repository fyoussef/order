import { columnOverflow } from "./column-overflow";

type Params = {
  columns: any[][];
  columnIdx: number;
  overColumnIdx: number;
  itemId: number;
  overItemId: number;
  pageHeightPx: number;
};

export const swapPositionsBetweenColumns = ({
  columns,
  columnIdx,
  overColumnIdx,
  itemId,
  overItemId,
  pageHeightPx,
}: Params) => {
  const oldIdx = columns[columnIdx].findIndex((slot) => slot.id == itemId);
  const newIdx = (columns[overColumnIdx] as any[]).findIndex(
    (slot) => slot.id == overItemId
  );
  const overflow = columnOverflow(
    [...columns[overColumnIdx], columns[columnIdx][oldIdx]],
    pageHeightPx
  );
  if (overflow) {
    return columns;
  }
  const removed = columns[columnIdx].filter(
    (slot: any) => slot.id !== columns[columnIdx][oldIdx].id
  );
  columns[overColumnIdx].splice(
    newIdx + 1,
    0,
    (columns[columnIdx] as any[])[oldIdx]
  );
  const cols = [];
  for (const col in columns) {
    if (Number(col) == columnIdx) {
      cols.push(removed);
    } else if (Number(col) == overColumnIdx) {
      cols.push(columns[overColumnIdx]);
    } else {
      cols.push(columns[col]);
    }
  }
  return cols;
};
