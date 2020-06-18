import * as React from "react";
import { useEffect, useState, useRef } from "react";
import { motion, useMotionValue } from "framer-motion";
import { findIndex, Position } from "./find-index";
import move from "array-move";
import "./DragListH.scss";

const DragListHItem = ({ style = {}, setPosition, moveItem, i }) => {
  const [isDragging, setDragging] = useState(false);

  // We'll use a `ref` to access the DOM element that the `motion.li` produces.
  // This will allow us to measure its width and position, which will be useful to
  // decide when a dragging element should switch places with its siblings.
  const ref = useRef(null);

  // By manually creating a reference to `dragOriginX` we can manipulate this value
  // if the user is dragging this DOM element while the drag gesture is active to
  // compensate for any movement as the items are re-positioned.
  const dragOriginX = useMotionValue(0);

  // Update the measured position of the item so we can calculate when we should rearrange.
  useEffect(() => {
    setPosition(i, {
      width: ref.current.offsetWidth,
      left: ref.current.offsetLeft,
    });
  });

  return (
    <motion.li
      ref={ref}
      initial={false}
      // If we're dragging, we want to set the zIndex of that item to be on left of the other items.
      animate={isDragging ? onTop : flat}
      style={style}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 1.12 }}
      drag="x"
      dragOriginX={dragOriginX}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={1}
      onDragStart={() => setDragging(true)}
      onDragEnd={() => setDragging(false)}
      onDrag={(e, { point }) => moveItem(i, point.x)}
      positionTransition={({ delta }) => {
        if (isDragging) {
          // If we're dragging, we want to "undo" the items movement within the list
          // by manipulating its dragOriginX. This will keep the item under the cursor,
          // even though it's jumping around the DOM.
          dragOriginX.set(dragOriginX.get() + delta.x);
        }

        // If `positionTransition` is a function and returns `false`, it's telling
        // Motion not to animate from its old position into its new one. If we're
        // dragging, we don't want any animation to occur.
        return !isDragging;
      }}
    />
  );
};

// Spring configs
const onTop = { zIndex: 1 };
const flat = {
  zIndex: 0,
  transition: { delay: 0.3 },
};

const initialColors = {
  "rgb(203, 212, 229)": 60,
  "rgb(8, 157, 228)": 80,
  "rgb(181, 227, 255)": 40,
  "rgb(132, 187, 228)": 100,
};

const DragListH = () => {
  const [colors, setColors] = useState(Object.keys(initialColors));

  // We need to collect an array of width and position data for all of this component's
  // `DragListHItem` children, so we can later us that in calculations to decide when a dragging
  // `DragListHItem` should swap places with its siblings.
  const positions = useRef([]).current;
  const setPosition = (i, offset) => (positions[i] = offset);

  // Find the ideal index for a dragging item based on its position in the array, and its
  // current drag offset. If it's different to its current index, we swap this item with that
  // sibling.
  const moveItem = (i, dragOffset) => {
    const targetIndex = findIndex(i, dragOffset, positions);
    if (targetIndex !== i) setColors(move(colors, i, targetIndex));
  };

  return (
    <ul className={"drag-list-h"}>
      {colors.map((color, i) => (
        <DragListHItem
          key={color}
          i={i}
          style={{ background: color, width: initialColors[color] }}
          setPosition={setPosition}
          moveItem={moveItem}
        />
      ))}
    </ul>
  );
};

export default DragListH;
