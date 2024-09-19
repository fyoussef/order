/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState } from "react";
import { Draggable } from "@/components/draggable";
import {
  closestCorners,
  DndContext,
  DragEndEvent,
  DragStartEvent,
} from "@dnd-kit/core";
import { Droppable } from "@/components/droppable";
import { orderColumns } from "@/lib/order-columns";
import { mock } from "../slots";
import { findColumnIdx } from "@/lib/find-column-index";
import { swapPositionsInTheSameColumn } from "@/lib/swap-positions-in-the-same-column";
import { swapPositionsBetweenColumns } from "@/lib/swap-positions-between-columns";

export default function Home() {
  const pageWidthPx = 1080;
  const pageHeightPx = 947;
  const [slots, setSlots] = useState(mock);
  const [columns, setColumns] = useState(Array.from({ length: 8 }).fill([]));
  const [pages, setPages] = useState<any[][][]>([]);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    if (document) {
      handleDisplayColumns(pageHeightPx);
    }
  }, []);

  useEffect(() => {
    if (pages.length > 0) {
      calcColumnsWidth(pageWidthPx);
      calcColumnsGapY(pageHeightPx, pages);
    }
  }, [pages]);

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
    const { cols, ignored } = orderColumns(pageHeightPx, slots);
    let pages = [cols];
    let rest = ignored;
    while (rest.length > 0) {
      const { cols, ignored } = orderColumns(pageHeightPx, rest);
      pages = [...pages, cols];
      rest = ignored;
    }
    setPages(pages);
  };

  const calcColumnsGapY = (pageHeightPx: number, pages: any[][][]) => {
    for (const page in pages) {
      const columns = pages[page];
      for (const col in columns) {
        const columnHeight = columns[col].reduce(
          (acc, item) => (acc += item.height),
          0
        );
        const blankSpace = pageHeightPx - columnHeight;
        const gap = blankSpace / (columns[col].length - 1);
        const element = document.querySelectorAll(
          `.slot-container.page-${page}`
        )[col] as HTMLDivElement;
        element.style.gap = gap + "px";
      }
    }
  };

  const handleDragStart = (event: DragStartEvent, page: number) => {
    setCurrentPage(page);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const columns: any = pages[currentPage];

    const grabAtColumn = findColumnIdx(columns, active.id.toString());
    const overColumn = findColumnIdx(columns, over.id.toString());

    const droppedInTheSameColumn = grabAtColumn == overColumn;
    if (droppedInTheSameColumn) {
      const cols = swapPositionsInTheSameColumn({
        columns,
        columnIdx: grabAtColumn!,
        itemId: Number(active.id.toString()),
        overItemId: Number(over.id.toString()),
      });
      setColumns(cols);
      setPages((prev) => {
        for (const pageIdx in prev) {
          if (Number(pageIdx) == currentPage) {
            prev[pageIdx] = cols;
          }
        }
        return prev;
      });
    } else {
      const cols = swapPositionsBetweenColumns({
        columns,
        columnIdx: grabAtColumn!,
        overColumnIdx: overColumn!,
        itemId: Number(active.id.toString()),
        overItemId: Number(over.id.toString()),
      });
      setColumns(cols);
      setPages((prev) => {
        for (const pageIdx in prev) {
          if (Number(pageIdx) == currentPage) {
            prev[pageIdx] = cols;
          }
        }
        return prev;
      });
      calcColumnsGapY(pageHeightPx, pages);
    }
  };

  return (
    <div className="grid gap-8">
      {pages.length > 0 &&
        pages.map((page, pageKey) => (
          <div
            key={pageKey}
            className="w-full max-w-[1080px] h-[947px] mx-auto bg-white"
          >
            <DndContext
              collisionDetection={closestCorners}
              onDragEnd={handleDragEnd}
              onDragStart={(e) => handleDragStart(e, pageKey)}
              id={`page-${pageKey}`}
            >
              <div className="flex gap-2">
                {page.map((col, colKey) => (
                  <Droppable key={colKey} id={`col-${colKey}`}>
                    <div
                      className={`flex flex-col slot-container page-${pageKey}`}
                    >
                      {(col as any[]).map((item) => (
                        <Droppable key={item.id} id={item.id}>
                          <Draggable id={item.id}>
                            <div
                              className="select-none bg-pink-200 text-white font-extrabold flex items-center justify-center text-4xl"
                              style={{ height: item.height }}
                            >
                              {item.id}
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
        ))}
    </div>
  );
}
