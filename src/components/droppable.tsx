import { useDroppable } from "@dnd-kit/core";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  id: string;
};

export function Droppable({ children, id }: Props) {
  const { setNodeRef } = useDroppable({
    id,
  });

  return <div ref={setNodeRef}>{children}</div>;
}
