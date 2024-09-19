export const orderColumns = (pageHeightPx: number, slots: any[]) => {
  const cols: any[][] = [[], [], [], [], [], [], [], []];
  const isAloccated = (slot: any) => {
    return cols.some((col) => col.findIndex((item) => item.id == slot.id) >= 0);
  };

  let columnHeight = 0;
  let currentColumn = 0;

  let ignored: any[] = [];

  const findOtherSlot = () => {
    let other;
    for (const slot of slots) {
      if (isAloccated(slot)) continue;
      columnHeight = columnHeight + slot.height;
      if (columnHeight > pageHeightPx) {
        columnHeight -= slot.height;
        continue;
      }
      other = slot;
    }
    if (other && ignored.some((item) => item.id == other.id)) {
      ignored = ignored.filter((item) => item.id != other.id);
    }
    return other;
  };

  for (const slot of slots) {
    if (isAloccated(slot)) continue;
    columnHeight = columnHeight + slot.height;
    if (columnHeight >= pageHeightPx) {
      columnHeight -= slot.height;
      const otherSlot = findOtherSlot();
      if (otherSlot) {
        cols[currentColumn].push(otherSlot);
        ignored.push(slot);
        continue;
      }
      currentColumn += 1;
      if (!cols[currentColumn]) {
        ignored.push(slot);
        continue;
      }
      cols[currentColumn].push(slot);
      columnHeight = slot.height;
      continue;
    }
    cols[currentColumn].push(slot);
  }

  for (const col of cols) {
    const colHeight = col.reduce((acc, item) => (acc += item.height), 0);
    const fits = ignored.find(
      (item) => item.height + colHeight <= pageHeightPx
    );
    if (fits) {
      ignored = ignored.filter((item) => item.id != fits.id);
      col.push(fits);
    }
  }

  return { cols, ignored };
};
