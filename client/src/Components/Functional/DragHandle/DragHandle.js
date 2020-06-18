import React, { useState } from "react";
import Utils from "../../../Utils";
import { motion } from "framer-motion";

const { classes } = Utils;

function DragHandle(props) {
  const ef = () => {}; // empty function
  const { children, classNames = [] } = props;
  const { onDrag = ef, onDown = ef, onUp = ef } = props;

  const [isActive, setIsActive] = useState(false);

  const setActive = () => {
    setIsActive(true);
  };
  const setInactive = () => {
    setIsActive(false);
  };

  return (
    <motion.div
      {...props}
      {...classes("noselect", classNames, isActive ? "active" : "")}
      onPan={onDrag}
      onMouseDown={onDown}
      onTouchStart={onDown}
      onMouseUp={onUp}
      onTouchEnd={onUp}
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
