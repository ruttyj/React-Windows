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
const { getNestedValue, classes, setImmutableValue } = Utils;

// Small component to change the background color based on size
const containerStyles = {
  width: "100%",
  display: "flex",
  flexGrow: 1,
  alignItems: "center",
  justifyContent: "center",
  padding: "20px",
};
const AdaptiveComponent = withResizeDetector(({ width, height, children }) => {
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
});

const DragWindow = withResizeDetector(function (props) {
  let { onToggleWindow: handleOnToggleWindow } = props;
  let { width: observedWidth, height: observedHeight } = props;
  let { title = "Untitled", containerSize } = props;
  const borderSize = 1;

  const [isDragEnabled, setDragEnabled] = useState(true);
  const [isFullSize, setIsFullSize] = useState(false);

  const minSize = {
    height: 100,
    width: 225,
  };

  const initialPosition = {
    top: 0,
    left: 0,
  };

  const initialSize = {
    height: 600,
    width: 600,
  };
  const initialWidth = 600;
  const initialHeight = 400;

  const [size, setSize] = useState({
    width: initialSize.width,
    height: initialSize.height,
  });

  useEffect(() => {
    setSize(initialSize);
  }, []);
  const [position, setPosition] = useState(initialPosition);
  const toggleDragEnabled = () => {
    setDragEnabled(!isDragEnabled);
  };

  const handleY = useMotionValue(0);
  const handleX = useMotionValue(0);
  const newX = useTransform(handleX, (v) => v);
  const newY = useTransform(handleY, (v) => v);
  if (isFullSize) {
    if (newX.get() !== 0) newX.set(0);
    if (newY.get() !== 0) newY.set(0);
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
    handleY.set(newPos.top);
    handleX.set(newPos.left);
    setPosition(newPos);
    setSize(newSize);
  };

  const onDrag = (e, info) => {
    if (isDragEnabled) {
      if (isFullSize) {
        setIsFullSize(false);
      }

      let delta = info.delta;
      if (delta.x !== 0 || delta.y !== 0) {
        const posY = handleY.get() + delta.y;
        const posX = handleX.get() + delta.x;
        const newPos = {
          left: posX,
          top: posY,
        };
        const newSize = {
          width: size.width,
          height: size.height,
        };
        updatePosAndSize(newPos, newSize, minSize, containerSize);
      }
    }
  };

  // Resize window
  const makeOnDragReize = (key) => {
    return function (e, info) {
      let delta = info.delta;
      if (delta.x !== 0 || delta.y !== 0) {
        let originalWidth = getNestedValue(size, "width", null);
        if (Number.isNaN(originalWidth)) originalWidth = initialWidth;

        let originalHeight = getNestedValue(size, "height", null);
        if (Number.isNaN(originalHeight)) originalHeight = initialHeight;

        let newPos = position;

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
          console.log("newPos", newPos);
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
    let newPos = { ...position };
    let newSize = { ...size };
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
      classNames={["title", !isDragEnabled ? "not-allowed" : ""]}
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
        onClick={() => setIsFullSize(!isFullSize)}
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
        title={isDragEnabled ? "Disable drag" : "Enable drag"}
      >
        {isDragEnabled ? <LockOpenIcon /> : <LockIcon />}
      </div>
      <div {...classes("button", "not-allowed")} title="Anchor">
        <FlareIcon />
      </div>
    </div>
  );

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
            classNames={["title", !isDragEnabled ? "not-allowed" : ""]}
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
        ...(isFullSize
          ? { top: "0px", left: "0px" }
          : { top: position.top, left: position.left }),
        ...(isFullSize
          ? { height: "100%", width: "100%" }
          : {
              height: size.height,
              width: size.width,
            }),
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
                <AdaptiveComponent>
                  <div {...classes("body", "grow")}>
                    <div {...classes("grow")}>
                      <div {...classes("column")}>
                        <div {...classes("row", "wrap", "align-left")}>
                          <div {...classes("column")}>
                            container:{" "}
                            <pre>
                              <xmp>
                                {JSON.stringify(containerSize, null, 2)}
                              </xmp>
                            </pre>
                          </div>
                          <div {...classes("column")}>
                            size:{" "}
                            <pre>
                              <xmp>{JSON.stringify(size, null, 2)}</xmp>
                            </pre>
                          </div>
                          <div {...classes("column")}>
                            position:
                            <pre>
                              <xmp>{JSON.stringify(position, null, 2)}</xmp>
                            </pre>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </AdaptiveComponent>
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
