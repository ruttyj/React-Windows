import * as React from "react";
import { useEffect, useState, useRef } from "react";
import { motion, useMotionValue } from "framer-motion";
import { findIndex, Position } from "./find-index";
import move from "array-move";
import Utils from "../../../Utils/";
import "./DragListH.scss";
const { isDef, isFunc, isArr, els, classes } = Utils;

const DragListHItem = ({ style = {}, setPosition, moveItem, i, children }) => {
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
    const tempData = {
      width: ref.current.offsetWidth,
      left: ref.current.offsetLeft,
    };
    setPosition(i, tempData);
  });
  //pointer-events: none;
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
    >
      <div
        style={{
          height: "100%",
          width: "fit-contents",
          ...(isDragging ? { pointerEvents: "none" } : {}),
        }}
      >
        {children}
      </div>
    </motion.li>
  );
};

// Spring configs
const onTop = { zIndex: 1 };
const flat = {
  zIndex: 0,
  transition: { delay: 0.3 },
};

const DragListH = (props) => {
  const { children } = props;
  const { keyOrder, setKeyOrder } = props;

  const positions = useRef([]).current;
  const setPosition = (i, offset) => (positions[i] = offset);

  const moveItem = (i, dragOffset) => {
    const targetIndex = findIndex(i, dragOffset, positions);
    if (targetIndex !== i) setKeyOrder(move(keyOrder, i, targetIndex));
  };

  // get child contents
  let childrenContents;
  if (isArr(children)) {
    childrenContents = children;
  }
  if (isFunc(children)) {
    const childArgs = {
      setPosition,
      positions,
      moveItem,
    };
    childrenContents = children(childArgs);
  }

  return <ul {...classes("drag-list", "drag-list-h")}>{childrenContents}</ul>;
};

const Example = (props) => {
  let { order, items } = props;

  let { setOrder } = props;
  const [localKeyOrder, setLocalKeyOrder] = useState(order);

  let _keyOrder = els(order, localKeyOrder);
  let _setKeyOrder = els(setOrder, setLocalKeyOrder);

  return (
    <DragListH
      keyOrder={_keyOrder}
      setKeyOrder={(...args) => {
        //console.log("Example setKeyOrder", ...args);
        _setKeyOrder(...args);
      }}
      children={({ positions, setPosition, moveItem }) => {
        const mapFn = (key, i) => {
          const item = items[key];
          const moveAttrs = {
            setPosition,
            moveItem,
          };

          return (
            <DragListHItem
              key={key}
              i={i}
              style={{
                width: "fit-content",
              }}
              {...moveAttrs}
              children={item}
            />
          );
        };
        const contentsList = _keyOrder.map(mapFn);
        return contentsList;
      }}
    />
  );
};

export const sample = Example;
export default Example;
