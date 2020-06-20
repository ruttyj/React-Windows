import React, { useState, useEffect } from "react";
import useConstant from "use-constant";
import { motion, useTransform, useMotionValue } from "framer-motion";
import { withResizeDetector } from "react-resize-detector";
import CloseIcon from "@material-ui/icons/Close";
import MinimizeIcon from "@material-ui/icons/Minimize";
import FlareIcon from "@material-ui/icons/Flare";
import LockIcon from "@material-ui/icons/Lock";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import FullscreenIcon from "@material-ui/icons/Fullscreen";
import FillContainer from "../../../../../src/Components/Containers/FillContainer/FillContainer";
import FillContent from "../../../../../src/Components/Containers/FillContainer/FillContent";
import FillHeader from "../../../../../src/Components/Containers/FillContainer/FillHeader";
import DragHandle from "../../../../../src/Components/Functional/DragHandle/";
import Utils from "../../../../../src/Utils/";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import "./DragWindow.scss";
const { getNestedValue, classes, setImmutableValue, isFunc, isDef } = Utils;
let ef = () => {}; // empty function
/*
 * Please excuse the mess
 */

const DragWindow = withResizeDetector(function(props) {
  let {
    window = {},
    containerSize,
    classNames = [],
    width, // provided by withResizeDetector
    height, // provided by withResizeDetector
    minSize = {},
    title = "Untitled",
    children,
    actions
  } = props;
  let {
    onSet = ef,
    onSetFocus = ef,
    onSetSize = ef,
    onSetPosition = ef,
    onClose = ef,
    onDown: handleOnDown = ef,
    onUp: handleOnUp = ef,
    onToggleWindow: handleOnToggleWindow,
    onSnapEnter = ef,
    onSnapLeave = ef,
    onSnapRelease = ef
  } = props;

  const zIndex = getNestedValue(window, "zIndex", 0);

  const isFocused = getNestedValue(window, "isFocused", false);

  const isTempDisablePointerEvents = getNestedValue(
    window,
    "isTempDisablePointerEvents",
    false
  );
  const disablePointerEventsOnBlur = getNestedValue(
    window,
    "disablePointerEventsOnBlur",
    false
  );

  const isFullSize = getNestedValue(window, "isFullSize", false);
  const setFullSize = value => {
    onSet("isFullSize", value);
  };

  const isDragDisabled = getNestedValue(window, "isDragDisabled", false);
  const setDragDisabled = value => {
    onSet("isDragDisabled", value);
  };

  const isResizeDisabled = getNestedValue(window, "isResizeDisabled", false);
  const setResizeDisabled = value => {
    onSet("isResizeDisabled", value);
  };
  const toggleResizeDisabled = () => {
    setResizeDisabled(!isResizeDisabled);
  };

  const isDragging = getNestedValue(window, "isDragging", false);
  let isMouseEventsDisabled = isDragging;

  const getMinSize = () => {
    return {
      height: getNestedValue(minSize, "height", 100),
      width: getNestedValue(minSize, "width", 250)
    };
  };

  const getSize = () => {
    return {
      height: window.size.height,
      width: window.size.width
    };
  };
  const getPosition = () => {
    return {
      left: window.position.left,
      top: window.position.top
    };
  };

  const initialPosition = getPosition();
  const initialSize = getSize();

  // Set the position if not defined on original object
  useEffect(() => {
    onSetSize(initialSize);
    onSetPosition(initialPosition);
  }, []);

  const toggleDragEnabled = () => {
    setDragDisabled(!isDragDisabled);
  };

  const handleSizeHeight = useMotionValue(initialSize.height);
  const handleSizeWidth = useMotionValue(initialSize.width);
  const handlePosTop = useMotionValue(initialPosition.top);
  const handlePosLeft = useMotionValue(initialPosition.left);
  const newPosLeft = useTransform(handlePosLeft, v => v);
  const newPosTop = useTransform(handlePosTop, v => v);

  if (isFullSize) {
    if (newPosLeft.get() !== 0) newPosLeft.set(0);
    if (newPosTop.get() !== 0) newPosTop.set(0);
    onSetPosition({
      top: newPosTop.get(),
      left: newPosLeft.get()
    });
  }

  // Dont allow to resize outside of bounds
  function restrictAxis(
    pos,
    posField,
    size,
    sizeField,
    minSize,
    containerSize
  ) {
    // Limit drag position
    if (pos[posField] < 0) pos[posField] = 0;

    if (containerSize[sizeField] < size[sizeField])
      size[sizeField] = containerSize[sizeField];

    let limitBounds;
    let difference;
    limitBounds = pos[posField] + size[sizeField];
    if (limitBounds > containerSize[sizeField]) {
      if (pos[posField] > 0) {
        difference = limitBounds - containerSize[sizeField];
        if (difference < pos[posField]) {
          pos[posField] -= difference;
        } else {
          pos[posField] = 0;
        }
      } else {
        limitBounds = pos[posField] + size[sizeField];
        difference = limitBounds - containerSize[sizeField];
        if (difference > 0) {
          size[sizeField] = containerSize[sizeField];
        }
      }
    }

    if (size[sizeField] < minSize[sizeField])
      size[sizeField] = minSize[sizeField];
  }

  // Side effect: will mutate the input values
  const updatePosAndSize = (newPos, newSize, minSize, containerSize) => {
    restrictAxis(newPos, "top", newSize, "height", minSize, containerSize);
    restrictAxis(newPos, "left", newSize, "width", minSize, containerSize);
    handlePosTop.set(newPos.top);
    handlePosLeft.set(newPos.left);

    handleSizeHeight.set(newSize.height);
    handleSizeWidth.set(newSize.width);

    onSetPosition(newPos);
    onSetSize(newSize);

    if (newPos.left < 4) {
      if (isFunc(onSnapEnter)) onSnapEnter(window, "w");
    } else {
      if (isFunc(onSnapLeave)) onSnapLeave(window, "w");
    }
  };

  const onDrag = (e, info) => {
    if (!isDragDisabled) {
      if (isFullSize) {
        setFullSize(false);
      }

      let delta = info.delta;
      if (delta.x !== 0 || delta.y !== 0) {
        const newPos = {
          left: handlePosLeft.get() + delta.x,
          top: handlePosTop.get() + delta.y
        };
        const newSize = {
          height: handleSizeHeight.get(),
          width: handleSizeWidth.get()
        };
        updatePosAndSize(newPos, newSize, getMinSize(), containerSize);
        onSetFocus(true);
      }
    }
  };

  const onDown = () => {
    onSet("isDragging", true);

    // let the parent know the window is being interacted with
    handleOnDown(window);
  };

  const onResizeDown = () => {
    let valueToSet = {};
    valueToSet.isDragging = true;
    if (!isResizeDisabled) {
      valueToSet.isResizing = true;
    }
    if (!isFocused) {
      onSetFocus(true);
    }
    let newValue = { ...window };
    Object.assign(newValue, valueToSet);
    onDown();
    onSet([], newValue);
  };

  const onUp = (e, info) => {
    let valueToSet = {};
    valueToSet.isDragging = false;
    valueToSet.isResizing = false;

    let newValue = { ...window };
    Object.assign(newValue, valueToSet);
    onSet([], newValue);

    // let the parent know the window is no longer being interacted with
    handleOnUp(window);
  };

  // Resize window
  const makeOnDragReize = key => {
    return function(e, info) {
      let delta = info.delta;
      if (!isResizeDisabled) {
        const size = {
          height: handleSizeHeight.get(),
          width: handleSizeWidth.get()
        };
        if (delta.x !== 0 || delta.y !== 0) {
          let originalWidth = getNestedValue(size, "width", null);
          if (Number.isNaN(originalWidth)) originalWidth = initialSize.width;

          let originalHeight = getNestedValue(size, "height", null);
          if (Number.isNaN(originalHeight)) originalHeight = initialSize.height;

          let newPos = getPosition();

          // Make sure values are defined
          let newSize = size;
          if (Number.isNaN(size.height)) {
            newSize = setImmutableValue(newSize, "height", originalHeight);
          }
          if (Number.isNaN(size.width)) {
            newSize = setImmutableValue(newSize, "width", originalWidth);
          }

          // Right side
          if (["e", "se", "ne"].includes(key)) {
            newSize = setImmutableValue(
              newSize,
              "width",
              originalWidth + delta.x
            );
          }

          // Left side
          if (["w", "sw", "nw"].includes(key)) {
            newSize = setImmutableValue(
              newSize,
              "width",
              originalWidth - delta.x
            );
            newPos = setImmutableValue(newPos, "left", newPos.left + delta.x);
          }

          // Top side
          if (["n", "ne", "nw"].includes(key)) {
            newSize = setImmutableValue(
              newSize,
              "height",
              originalHeight - delta.y
            );
            newPos = setImmutableValue(newPos, "top", newPos.top + delta.y);
          }

          // Bottom side
          if (["s", "se", "sw"].includes(key)) {
            newSize = setImmutableValue(
              newSize,
              "height",
              originalHeight + delta.y
            );
          }

          updatePosAndSize(newPos, newSize, getMinSize(), containerSize);
        }
      }
    };
  };

  // Refresh size of model screen resized
  useEffect(() => {
    let newPos = { ...getPosition() };
    let newSize = { ...getSize() };
    updatePosAndSize(newPos, newSize, getMinSize(), containerSize);
  }, [containerSize.width, containerSize.height]);

  // Drag handles
  let dragHandleContents = (
    <>
      <DragHandle
        onDrag={makeOnDragReize("e")}
        onDown={onResizeDown}
        onUp={onUp}
        disabled={isResizeDisabled}
        classNames={["resize-handle", "resize-handle-e"]}
      />
      <DragHandle
        onDrag={makeOnDragReize("w")}
        onDown={onResizeDown}
        onUp={onUp}
        disabled={isResizeDisabled}
        classNames={["resize-handle", "resize-handle-w"]}
      />
      <DragHandle
        onDrag={makeOnDragReize("n")}
        onDown={onResizeDown}
        onUp={onUp}
        disabled={isResizeDisabled}
        classNames={["resize-handle", "resize-handle-n"]}
      />
      <DragHandle
        onDrag={makeOnDragReize("s")}
        onDown={onResizeDown}
        onUp={onUp}
        disabled={isResizeDisabled}
        classNames={["resize-handle", "resize-handle-s"]}
      />
      <DragHandle
        onDrag={makeOnDragReize("se")}
        onDown={onResizeDown}
        onUp={onUp}
        disabled={isResizeDisabled}
        classNames={["resize-handle-corner", "resize-handle-se"]}
      />
      <DragHandle
        onDrag={makeOnDragReize("ne")}
        onDown={onResizeDown}
        onUp={onUp}
        disabled={isResizeDisabled}
        classNames={["resize-handle-corner", "resize-handle-ne"]}
      />
      <DragHandle
        onDrag={makeOnDragReize("nw")}
        onDown={onResizeDown}
        onUp={onUp}
        disabled={isResizeDisabled}
        classNames={["resize-handle-corner", "resize-handle-nw"]}
      />
      <DragHandle
        onDrag={makeOnDragReize("sw")}
        onDown={onResizeDown}
        onUp={onUp}
        disabled={isResizeDisabled}
        classNames={["resize-handle-corner", "resize-handle-sw"]}
      />
    </>
  );

  const childArgs = {
    containerSize,
    size: getSize(),
    position: getPosition()
  };

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // Define the contents of the UI
  let headerContents = "";
  let titleContents = (
    <DragHandle
      onDrag={onDrag}
      onDown={() => onDown()}
      onUp={onUp}
      onClick={() => onSetFocus()}
      classNames={["title", isDragDisabled ? "not-allowed" : ""]}
    >
      {isDef(title) ? (isFunc(title) ? title(childArgs) : title) : ""}
    </DragHandle>
  );
  let leftHeaderActionContents = (
    <div {...classes("actions", "row")}>
      <div {...classes("button")} title="Close" onClick={() => onClose()}>
        <div {...classes("circle red")} />
      </div>

      <div {...classes("button")} onClick={() => handleOnToggleWindow()}>
        <div {...classes("circle yellow")} />
      </div>

      <div
        {...classes("button")}
        onClick={() => setFullSize(!isFullSize)}
        title={isFullSize ? "Restore size" : "Maximize size"}
      >
        <div {...classes("circle green")} />
      </div>
    </div>
  );

  let lockDragLabel = isDragDisabled ? "Drag disabled" : "Drag enabled";
  let lockResizeLabel = isResizeDisabled ? "Resize disabled" : "Resize enabled";

  let rightHeaderActionContents = (
    <div {...classes("actions", "row", "right")} style={{ width: "102px" }}>
      <div {...classes("button")} onClick={handleClick}>
        <MoreVertIcon />
      </div>

      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem
          onClick={handleClose}
          onClick={() => {
            toggleDragEnabled();
          }}
        >
          <ListItemIcon>
            {!isDragDisabled ? <LockOpenIcon /> : <LockIcon />}
          </ListItemIcon>{" "}
          {lockDragLabel}
        </MenuItem>

        <MenuItem
          onClick={() => {
            toggleResizeDisabled();
          }}
        >
          <ListItemIcon>
            {!isResizeDisabled ? <LockOpenIcon /> : <LockIcon />}
          </ListItemIcon>
          {lockResizeLabel}
        </MenuItem>
      </Menu>
    </div>
  );

  const size = getSize();
  if (size.width > 300) {
    headerContents = (
      <div {...classes("header", "noselect")}>
        <div {...classes("row")}>
          {leftHeaderActionContents}
          {titleContents}
          {rightHeaderActionContents}
        </div>
      </div>
    );
  } else {
    headerContents = (
      <div {...classes("header", "noselect")}>
        <div {...classes("row")}>
          {leftHeaderActionContents}
          <DragHandle
            onDrag={onDrag}
            onDown={() => onDown()}
            onUp={onUp}
            onClick={() => onSetFocus()}
            classNames={["title", isDragDisabled ? "not-allowed" : ""]}
          />
          {rightHeaderActionContents}
        </div>
        <div {...classes("row")}>{titleContents}</div>
      </div>
    );
  }

  let childContents = "";
  if (isDef(children)) {
    if (isFunc(children)) {
      let Child = children;
      childContents = <Child {...childArgs} />;
    } else {
      childContents = children;
    }
  }

  // Window animation
  let animateState;
  if (window.isOpen) {
    animateState = "visible";
  } else {
    animateState = "hidden";
  }
  const variants = {
    hidden: {
      opacity: 0,
      y: 100,
      transition: "linear",
      transitionEnd: {
        display: "none"
      }
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: "linear",
      display: "flex"
    }
  };

  let disablePointerEvents =
    isMouseEventsDisabled ||
    isTempDisablePointerEvents ||
    (disablePointerEventsOnBlur && !isFocused);

  const windowSize = getSize();
  return (
    <motion.div
      {...classes("window", "blurred_bkgd", classNames)}
      onMouseDown={() => {
        if (!isFocused) onSetFocus(true);
      }}
      onMouseDown={() => {
        if (!isFocused) onSetFocus(true);
      }}
      onTapStart={() => {
        if (!isFocused) onSetFocus(true);
      }}
      variants={variants}
      initial="hidden"
      exit="hidden"
      animate={animateState}
      style={{
        position: "absolute",
        zIndex: zIndex,
        ...(isFullSize ? { top: "0px", left: "0px" } : getPosition()),
        ...(isFullSize
          ? { height: "100%", width: "100%" }
          : {
              ...windowSize,
              maxHeight: windowSize.height,
              maxWidth: windowSize.width
            })
      }}
      transition={{ type: "spring", stiffness: 200 }}
    >
      <div {...classes("full_wrapper", "main_bkgd", "relative")}>
        <div {...classes("window-shell", "grow")}>
          {dragHandleContents}
          <div {...classes(["inner_content", "grow", "column"])}>
            <FillContainer>
              <FillHeader>{headerContents}</FillHeader>

              <FillContent
                classNames={[
                  "window-content",
                  "tint-bkgd",
                  "column",
                  disablePointerEvents && "disable-pointer-events"
                ]}
              >
                {childContents}
              </FillContent>

              {isDef(actions)
                ? isFunc(actions)
                  ? actions(childArgs)
                  : actions
                : ""}
            </FillContainer>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

export default DragWindow;
