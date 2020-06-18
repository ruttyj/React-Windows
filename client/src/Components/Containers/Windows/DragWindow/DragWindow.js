import React, { useState, useEffect } from "react";
import { withResizeDetector } from "react-resize-detector";
import { motion, useTransform, useMotionValue } from "framer-motion";
import CloseIcon from "@material-ui/icons/Close";
import MinimizeIcon from "@material-ui/icons/Minimize";
import FlareIcon from "@material-ui/icons/Flare";
import LockIcon from "@material-ui/icons/Lock";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import FullscreenIcon from "@material-ui/icons/Fullscreen";
import FillContainer from "../../../../../src/Components/Containers/FillContainer/FillContainer";
import FillContent from "../../../../../src/Components/Containers/FillContainer/FillContent";
import FillHeader from "../../../../../src/Components/Containers/FillContainer/FillHeader";
import FillFooter from "../../../../../src/Components/Containers/FillContainer/FillFooter";
import DragHandle from "../../../../../src/Components/Functional/DragHandle/";
import Utils from "../../../../../src/Utils";
import DragListV from "../../../../../src/Components/Containers/DragListV";

const { getNestedValue, classes, setImmutableValue, isFunc } = Utils;

/*
 * Please excuse the mess
 */

// Small component to change the background color based on size
const containerStyles = {
  width: "100%",
  display: "flex",
  flexGrow: 1,
  alignItems: "center",
  justifyContent: "center",
  padding: "20px",
};
const SizeBackgroundColor = withResizeDetector(
  ({ width, height, children }) => {
    const [color, setColor] = useState("#0099ffA0");
    useEffect(() => {
      setColor(
        width > 500 ? "#0099ffA0" : width > 300 ? "#00bb00A0" : "#ff9900A0"
      );
    }, [width]);

    return (
      <div
        {...classes(["column"])}
        style={{
          transition: "all 150ms linear",
          backgroundColor: color,
          ...containerStyles,
        }}
      >
        <div> {children}</div>
      </div>
    );
  }
);

const DragWindow = withResizeDetector(function (props) {
  let ef = () => {}; // empty function
  let { onToggleWindow: handleOnToggleWindow } = props;
  let { onSnapEnter = ef, onSnapLeave = ef, onSnapRelease = ef } = props; // enter: "enter snap range", leave: "leave snap range", release: "release after being involved with a snap zone"
  let { width: observedWidth, height: observedHeight } = props;
  let { window = {}, title = "Untitled", containerSize } = props;
  let { onSet, onSetState, onSetSize, onSetPosition } = props;
  const borderSize = 1;

  const isFullSize = getNestedValue(window, "isFullSize", false);
  const setFullSize = (value) => {
    onSet("isFullSize", value);
  };

  const isDragDisabled = getNestedValue(window, "isDragDisabled", false);
  const setDragDisabled = (value) => {
    onSet("isDragDisabled", value);
  };

  const minSize = {
    height: 100,
    width: 225,
  };

  const initialPosition = {
    top: window.position.top,
    left: window.position.left,
  };

  const initialSize = {
    height: window.size.height,
    width: window.size.width,
  };

  const getSize = () => {
    return {
      height: window.size.height,
      width: window.size.width,
    };
  };
  const getPosition = () => {
    return {
      left: window.position.left,
      top: window.position.top,
    };
  };

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
  const newPosLeft = useTransform(handlePosLeft, (v) => v);
  const newPosTop = useTransform(handlePosTop, (v) => v);

  const newSizeWidth = useTransform(handleSizeWidth, (v) => v);
  const newSizeHeight = useTransform(handleSizeHeight, (v) => v);

  if (isFullSize) {
    if (newPosLeft.get() !== 0) newPosLeft.set(0);
    if (newPosTop.get() !== 0) newPosTop.set(0);
    onSetPosition({
      top: newPosTop.get(),
      left: newPosLeft.get(),
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
          top: handlePosTop.get() + delta.y,
        };
        const newSize = {
          height: handleSizeHeight.get(),
          width: handleSizeWidth.get(),
        };
        updatePosAndSize(newPos, newSize, minSize, containerSize);
      }
    }
  };

  // Resize window
  const makeOnDragReize = (key) => {
    return function (e, info) {
      let delta = info.delta;
      const size = {
        height: handleSizeHeight.get(),
        width: handleSizeWidth.get(),
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

        updatePosAndSize(newPos, newSize, minSize, containerSize);
      }
    };
  };

  // Refresh size of model screen resized
  useEffect(() => {
    let newPos = { ...getPosition() };
    let newSize = { ...getSize() };
    updatePosAndSize(newPos, newSize, minSize, containerSize);
  }, [containerSize.width, containerSize.height]);

  let dragHandleContents = (
    <>
      <DragHandle
        onDrag={makeOnDragReize("e")}
        classNames={["resize-handle", "resize-handle-e"]}
      ></DragHandle>
      <DragHandle
        onDrag={makeOnDragReize("w")}
        classNames={["resize-handle", "resize-handle-w"]}
      ></DragHandle>
      <DragHandle
        onDrag={makeOnDragReize("n")}
        classNames={["resize-handle", "resize-handle-n"]}
      ></DragHandle>
      <DragHandle
        onDrag={makeOnDragReize("s")}
        classNames={["resize-handle", "resize-handle-s"]}
      ></DragHandle>
      <DragHandle
        onDrag={makeOnDragReize("se")}
        classNames={["resize-handle-corner", "resize-handle-se"]}
      ></DragHandle>
      <DragHandle
        onDrag={makeOnDragReize("ne")}
        classNames={["resize-handle-corner", "resize-handle-ne"]}
      ></DragHandle>
      <DragHandle
        onDrag={makeOnDragReize("nw")}
        classNames={["resize-handle-corner", "resize-handle-nw"]}
      ></DragHandle>
      <DragHandle
        onDrag={makeOnDragReize("sw")}
        classNames={["resize-handle-corner", "resize-handle-sw"]}
      ></DragHandle>
    </>
  );

  // Define the contents of the UI
  let headerContents = "";
  let titleContents = (
    <DragHandle
      onDrag={onDrag}
      classNames={["title", isDragDisabled ? "not-allowed" : ""]}
    >
      {title}
    </DragHandle>
  );
  let leftHeaderActionContents = (
    <div {...classes("actions", "row")}>
      <div {...classes("button", "not-allowed")} title="Close">
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

  let rightHeaderActionContents = (
    <div {...classes("actions", "row")}>
      <div
        {...classes("button")}
        onClick={() => toggleDragEnabled()}
        title={!isDragDisabled ? "Disable drag" : "Enable drag"}
      >
        {!isDragDisabled ? <LockOpenIcon /> : <LockIcon />}
      </div>
      <div {...classes("button", "not-allowed")} title="Anchor">
        <FlareIcon />
      </div>
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
            classNames={["title", isDragDisabled ? "not-allowed" : ""]}
          ></DragHandle>
          {rightHeaderActionContents}
        </div>
        <div {...classes("row")}>{titleContents}</div>
      </div>
    );
  }

  return (
    <motion.div
      exit={{ opacity: 0, y: 100, transition: "linear" }}
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0, transition: "linear" }}
      style={{
        position: "absolute",
        ...(isFullSize ? { top: "0px", left: "0px" } : getPosition()),
        ...(isFullSize ? { height: "100%", width: "100%" } : getSize()),
      }}
      transition={{ type: "spring", stiffness: 200 }}
      {...classes("window", "blurred_bkgd")}
    >
      <div {...classes("full_wrapper", "main_bkgd", "relative")}>
        <div {...classes("window-shell", "grow")}>
          {dragHandleContents}
          <div {...classes(["inner_content", "grow", "column"])}>
            <FillContainer>
              <FillHeader>{headerContents}</FillHeader>

              <FillContent
                classNames={["window-content", "tint-bkgd", "column"]}
              >
                <SizeBackgroundColor>
                  <div {...classes("body", "grow")}>
                    <div {...classes("grow")}>
                      <div {...classes("column")}>
                        <div {...classes("row", "wrap")}>
                          <div {...classes("column", "align-left")}>
                            container:{" "}
                            <pre>
                              <xmp>
                                {JSON.stringify(containerSize, null, 2)}
                              </xmp>
                            </pre>
                          </div>
                          <div {...classes("column", "align-left")}>
                            size:{" "}
                            <pre>
                              <xmp>{JSON.stringify(getSize(), null, 2)}</xmp>
                            </pre>
                          </div>
                          <div {...classes("column", "align-left")}>
                            position:
                            <pre>
                              <xmp>
                                {JSON.stringify(getPosition(), null, 2)}
                              </xmp>
                            </pre>
                          </div>
                        </div>
                        <DragListV></DragListV>
                      </div>
                    </div>
                  </div>
                </SizeBackgroundColor>
              </FillContent>

              <FillFooter
                height={40}
                classNames={["footer", "actions", "center-center"]}
              >
                <div {...classes("spacer")} />
                <div {...classes("button", "not-allowed")}>Cancel</div>

                <div {...classes("button", "not-allowed")}>Confirm</div>
              </FillFooter>
            </FillContainer>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

export default DragWindow;
