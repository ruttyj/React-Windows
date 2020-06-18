import { isDef, trueFunc, emptyFunc } from "../../utils/";

import React from "react";

import { useDrop } from "react-dnd";

export default ({
  children,
  style = {},
  greedy = false,
  accept = "DRAG",
  dropProps = {},
  onDrop = trueFunc,
  onHover = trueFunc,
  canDrop = trueFunc,
}) => {
  const [{ isOver, isOverCurrent }, drop] = useDrop({
    accept: accept,
    drop: (dragProps, monitor) => {
      const didDrop = monitor.didDrop();
      if (didDrop && !greedy) {
        return;
      }
      onDrop({ dragProps, monitor, dropProps });
    },
    hover: (dragProps, monitor) => onHover({ dragProps, monitor, dropProps }),
    canDrop: (dragProps, monitor) => canDrop({ dragProps, monitor, dropProps }),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      isOverCurrent: monitor.isOver({ shallow: true }),
    }),
  });

  let isTargeted = isOverCurrent || (isOver && greedy);

  return (
    <div
      ref={drop}
      className="peanut"
      style={{
        position: "relative",
        minWidth: "10px",
        minHeight: "10px",
        display: "inline-flex",
        ...style,
      }}
    >
      <div style={{ display: "inline-flex", ...style }}>{children}</div>
      {isTargeted && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            height: "100%",
            width: "100%",
            zIndex: 1,
            opacity: 0.2,
            backgroundColor: "black",
          }}
        />
      )}
    </div>
  );
};
