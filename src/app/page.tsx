"use client";

import { useEffect, useState } from "react";
import { mock } from "./slots";
import { Draggable } from "@/components/draggable";
import { closestCorners, DndContext, DragEndEvent } from "@dnd-kit/core";
import { Droppable } from "@/components/droppable";
import { swapPositionsInTheSameColumn } from "@/lib/swap-positions-in-the-same-column";
import { swapPositionsBetweenColumns } from "@/lib/swap-positions-between-columns";
import { findColumnIdx } from "@/lib/find-column-index";
import { orderColumns } from "@/lib/order-columns";

export default function Home() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [slots, setSlots] = useState(mock);
  const [columns, setColumns] = useState(Array.from({ length: 8 }).fill([]));

  useEffect(() => {
    if (document) {
      const page = document.getElementById("page") as HTMLDivElement;
      const pageWidthPx = page.clientWidth;
      calcColumnsWidth(pageWidthPx);
      const pageHeightPx = page.clientHeight;
      handleDisplayColumns(pageHeightPx);
    }
  }, []);

  const calcColumnsWidth = (pageWidthPx: number) => {
    const gapBetweenColumns = 8;
    const columnWidth =
      (pageWidthPx - gapBetweenColumns * (columns.length - 1)) / columns.length;
    const slots = document.querySelectorAll(
      ".slot-container"
    ) as NodeListOf<HTMLDivElement>;
    slots.forEach((element) => {
      element.style.width = columnWidth + "px";
    });
  };

  const handleDisplayColumns = (pageHeightPx: number) => {
    const { cols } = orderColumns(pageHeightPx, slots);
    calcColumnsGapY(pageHeightPx, cols);
    setColumns(cols);
  };

  const calcColumnsGapY = (pageHeightPx: number, columns: any[][]) => {
    for (const col in columns) {
      const columnHeight = columns[col].reduce(
        (acc, item) => (acc += item.height),
        0
      );
      const blankSpace = pageHeightPx - columnHeight;
      const gap = blankSpace / (columns[col].length - 1);
      const element = document.querySelectorAll(".slot-container")[
        col
      ] as HTMLDivElement;
      element.style.gap = gap + "px";
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const grabAtColumn = findColumnIdx(columns as any, active.id.toString());
    const overColumn = findColumnIdx(columns as any, over.id.toString());

    const droppedInTheSameColumn = grabAtColumn == overColumn;
    if (droppedInTheSameColumn) {
      const cols = swapPositionsInTheSameColumn({
        columns: columns as any,
        columnIdx: grabAtColumn!,
        itemId: Number(active.id.toString()),
        overItemId: Number(over.id.toString()),
      });
      setColumns(cols);
    } else {
      const cols = swapPositionsBetweenColumns({
        columns: columns as any,
        columnIdx: grabAtColumn!,
        overColumnIdx: overColumn!,
        itemId: Number(active.id.toString()),
        overItemId: Number(over.id.toString()),
      });
      setColumns(cols);
    }
  };

  return (
    <div id="page" className="w-full max-w-[1080px] h-screen mx-auto bg-white">
      <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
        <div className="flex gap-2">
          {columns.map((col, key) => (
            <Droppable key={key} id={`col-${key}`}>
              <div className="min-h-screen flex flex-col slot-container">
                {(col as any[]).map((item) => (
                  <Droppable key={item.id} id={item.id}>
                    <Draggable id={item.id}>
                      <div className="select-none">
                        <Slot text={item.content} id={item.id} />
                      </div>
                    </Draggable>
                  </Droppable>
                ))}
              </div>
            </Droppable>
          ))}
        </div>
      </DndContext>
    </div>
  );
}

function Slot({ text, id }: { text: string; id: number }) {
  return (
    <div className="inline-block leading-4">
      <p className="font-bold text-xl leading-[1.15rem]">{id}: TÍTULO</p>
      <p className="hyphens-auto">{text}</p>
    </div>
  );
}
