import React, { useState } from "react";
import Utils from "../../../Utils";
import { motion } from "framer-motion";
import { useUp } from "../../../Utils/useWindowEvents";

const { isDef, classes } = Utils;

function DragHandle(props) {
  const ef = () => {}; // empty function

  const { disabled = false } = props;

  const { children, classNames = [] } = props;
  const { onDrag = ef, onDown = ef, onUp = ef } = props;

  const [isActive, setIsActive] = useState(false);
  const [isDown, setDown] = useState(false);

  const setActive = () => {
    if (!disabled) {
      setIsActive(true);
    }
  };
  const setInactive = () => {
    setIsActive(false);
  };

  const handleOnDown = () => {
    if (!disabled) {
      setDown(true);
      onDown();
    }
  };

  useUp(() => {
    if (isDown) {
      onUp();
    }
  });

  const _props = { ...props };
  if (isDef(_props.onUp)) delete _props.onUp;
  if (isDef(_props.onDown)) delete _props.onDown;

  return (
    <motion.div
      {..._props}
      {...classes(
        "noselect",
        !disabled ? classNames : "",
        isActive ? "active" : ""
      )}
      onPan={onDrag}
      onMouseDown={handleOnDown}
      onTouchStart={handleOnDown}
      onMouseEnter={setActive}
      onMouseLeave={setInactive}
      onTapStart={setActive}
      onTouchEnd={setInactive}
      onPanEnd={setInactive}
    >
      {children}
    </motion.div>
  );
}

export default DragHandle;
