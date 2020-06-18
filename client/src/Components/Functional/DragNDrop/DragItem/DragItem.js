import React from "react";
import { useDrag } from "react-dnd";

export default ({ children, item }) => {
  const [{ isDragging }, drag] = useDrag({
    item,
    collect: monitor => ({
      isDragging: !!monitor.isDragging()
    })
  });

  return (
    <div
      ref={drag}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: "move"
      }}
    >
      {children}
    </div>
  );
};
