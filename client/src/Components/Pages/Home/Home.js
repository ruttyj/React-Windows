import React, { useState, useEffect } from "react";
import { withResizeDetector } from "react-resize-detector";
import classNames from "classname";
import Utils from "./Utils";
import SizeTaddleTail from "../../SizeTaddleTail";
import SideBar from "../../SideBar/";
import { motion, useTransform, useMotionValue } from "framer-motion";
import CloseIcon from "@material-ui/icons/Close";
import MinimizeIcon from "@material-ui/icons/Minimize";
import ChatBubbleIcon from "@material-ui/icons/ChatBubble";
import BugReportIcon from "@material-ui/icons/BugReport";
import PeopleIcon from "@material-ui/icons/People";
import HomeIcon from "@material-ui/icons/Home";
import MenuIcon from "@material-ui/icons/Menu";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import FlareIcon from "@material-ui/icons/Flare";
import FullscreenIcon from "@material-ui/icons/Fullscreen";
import FullscreenExitIcon from "@material-ui/icons/FullscreenExit";
import OpenWithIcon from "@material-ui/icons/OpenWith";
import FillContainer from "../../Containers/FillContainer/FillContainer";
import FillContent from "../../Containers/FillContainer/FillContent";
import FillHeader from "../../Containers/FillContainer/FillHeader";
import FillFooter from "../../Containers/FillContainer/FillFooter";
import RelLayer from "../../Layers/RelLayer";
import AbsLayer from "../../Layers/AbsLayer";
import config from "../../../config";

import "./Home.scss";
const {
  els,
  getNestedValue,
  isDef,
  isArr,
  isStr,
  classes,
  setImmutableValue,
} = Utils;

function clamp(min, value, max) {
  return Math.min(Math.max(min, value), max);
}

const containerStyles = {
  width: "100%",
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const AdaptiveComponent = withResizeDetector(({ width, height, children }) => {
  const [color, setColor] = useState("red");
  useEffect(() => {
    setColor(width > 500 ? "#0099ffA0" : "#00bb00A0");
  }, [width]);

  return (
    <div
      {...classes(["column"])}
      style={{ backgroundColor: color, ...containerStyles }}
    >
      <div>{`(${width} x ${height})`}</div>
      <div> {children}</div>
    </div>
  );
});

const DragWindow = withResizeDetector(function (props) {
  let { width: observedWidth, height: observedHeight, wrapperSize } = props;
  const borderSize = 1;
  const windowSize = {
    width: Math.ceil(parseFloat(observedWidth)) + 2 * borderSize,
    height: Math.ceil(parseFloat(observedHeight)) + 2 * borderSize,
  };
  const [isDragEnabled, setDragEnabled] = useState(true);
  const [isFullSize, setIsFullSize] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const minSize = {
    height: 100,
    width: 300,
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
    console.log("toggle");
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
  function restrictAxis(pos, posField, size, sizeField, minSize, wrapperSize) {
    // Limit drag position
    if (pos[posField] < 0) pos[posField] = 0;

    if (wrapperSize[sizeField] < size[sizeField])
      size[sizeField] = wrapperSize[sizeField];

    let limitBounds;
    let difference;
    limitBounds = pos[posField] + size[sizeField];
    if (limitBounds > wrapperSize[sizeField]) {
      if (pos[posField] > 0) {
        difference = limitBounds - wrapperSize[sizeField];
        if (difference < pos[posField]) {
          pos[posField] -= difference;
        } else {
          pos[posField] = 0;
        }
      } else {
        limitBounds = pos[posField] + size[sizeField];
        difference = limitBounds - wrapperSize[sizeField];
        if (difference > 0) {
          size[sizeField] = wrapperSize[sizeField];
        }
      }
    }

    if (size[sizeField] < minSize[sizeField])
      size[sizeField] = minSize[sizeField];
  }

  // Side effect: will mutate the input values
  const updatePosAndSize = (newPos, newSize, minSize, wrapperSize) => {
    restrictAxis(newPos, "top", newSize, "height", minSize, wrapperSize);
    restrictAxis(newPos, "left", newSize, "width", minSize, wrapperSize);
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
        updatePosAndSize(newPos, newSize, minSize, wrapperSize);
      }
    }
  };

  // Resize window
  const makeOnDragReize = (key) => {
    return function (e, info) {
      let delta = info.delta;
      if (delta.x !== 0 || delta.y !== 0) {
        console.log(key, delta);

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

        // Top side
        if (["s", "se", "sw"].includes(key)) {
          newSize = setImmutableValue(
            newSize,
            "height",
            originalHeight + delta.y
          );
        }

        updatePosAndSize(newPos, newSize, minSize, wrapperSize);
      }
    };
  };

  useEffect(() => {
    console.log("useEffect");
    let newPos = { ...position };
    let newSize = { ...size };
    console.log({ newPos, newSize, minSize, wrapperSize });
    updatePosAndSize(newPos, newSize, minSize, wrapperSize);
  }, [wrapperSize.width, wrapperSize.height]);

  return (
    <motion.div
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
          <div {...classes(["inner_content", "grow", "column"])}>
            <FillContainer>
              <FillHeader>
                <div {...classes("header", "noselect")}>
                  <div {...classes("row")}>
                    <div {...classes("actions", "row")}>
                      <div {...classes("button", "now-allowed")} title="Anchor">
                        <FlareIcon />
                      </div>
                      <div
                        {...classes("button")}
                        onClick={() => toggleDragEnabled()}
                        title={isDragEnabled ? "Disable drag" : "Enable drag"}
                      >
                        {isDragEnabled ? <OpenWithIcon /> : <CloseIcon />}
                      </div>
                    </div>
                    <DragHandle
                      onDrag={onDrag}
                      classNames={[
                        "title",
                        !isDragEnabled ? "not-allowed" : "",
                      ]}
                    >
                      Title ({observedWidth}
                      {" x "}
                      {observedHeight})
                    </DragHandle>
                    <div {...classes("actions", "row")}>
                      <div
                        {...classes("button", "now-allowed")}
                        onClick={() => setIsMinimized(!isMinimized)}
                      >
                        <MinimizeIcon />
                      </div>
                      <div
                        {...classes("button", "now-allowed")}
                        onClick={() => setIsFullSize(!isFullSize)}
                        title={isFullSize ? "Restore size" : "Maximize size"}
                      >
                        {isFullSize ? (
                          <FullscreenExitIcon />
                        ) : (
                          <FullscreenIcon />
                        )}
                      </div>
                      <div {...classes("button", "now-allowed")} title="Close">
                        <CloseIcon />
                      </div>
                    </div>
                  </div>
                </div>
              </FillHeader>

              <FillContent
                classNames={["window-content", "tint-bkgd", "column"]}
              >
                <AdaptiveComponent>
                  <div {...classes("body", "grow")}>
                    <div {...classes("grow")}>
                      <div {...classes("column")}>
                        <div {...classes("row")}>
                          {isDragEnabled
                            ? "Dragging enabled"
                            : "Dragging disabled"}
                        </div>
                        <div {...classes("row", "align-left")}>
                          <div {...classes("column")}>
                            wrapperSize:{" "}
                            <pre>
                              <xmp>{JSON.stringify(wrapperSize, null, 2)}</xmp>
                            </pre>
                          </div>
                          <div {...classes("column")}>
                            windowSize:{" "}
                            <pre>
                              <xmp>{JSON.stringify(windowSize, null, 2)}</xmp>
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

              <FillFooter height={60} classNames={["center-center"]}>
                Footer
              </FillFooter>
            </FillContainer>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

function WindowArea(props) {
  const { width, height } = props;
  const size = { width, height };
  return (
    <RelLayer {...classes("full_wrapper", "full")}>
      <RelLayer>
        <div {...classes("top-left-indicator")}></div>
        <div {...classes("left-indicator")}></div>
        <div {...classes("bottom-left-indicator")}></div>
        <DragWindow wrapperSize={size} />
      </RelLayer>
    </RelLayer>
  );
}
const WindowAreaResizeDetector = withResizeDetector(WindowArea);

function Home(props) {
  const [windows, setWindows] = useState([{}]);
  return (
    <div {...classes("full", "row", "main_bkgd")}>
      <AppSideBar></AppSideBar>
      <FillContainer>
        <FillHeader>
          <AppHeader />
        </FillHeader>
        <FillContent>
          <WindowAreaResizeDetector />
        </FillContent>
        <FillFooter height={40}>
          <div {...classes("full")}>
            <BlurredWrapper>
              <div {...classes("full", "tinted-light", "center-center")}>
                Footer
              </div>
            </BlurredWrapper>
          </div>
        </FillFooter>
      </FillContainer>
    </div>
  );
}

function AppHeader(props) {
  return (
    <div {...classes("app-header")}>
      <BlurredWrapper>
        <div
          {...classes(
            "full",
            "tinted-light",
            "space-between",
            "v-align-center"
          )}
        >
          <ToolbarButton>R</ToolbarButton>
          <ToolbarButton>C</ToolbarButton>
          <ToolbarButton>L</ToolbarButton>
        </div>
      </BlurredWrapper>
    </div>
  );
}

function ToolbarButton(props = {}) {
  const { classNames = [], style = {}, children } = props;
  return (
    <div
      {...classes("flex", "center-center", classNames)}
      style={{ width: "75px", height: "75px", ...style }}
    >
      {children}
    </div>
  );
}

function DragHandle(props) {
  const { children, classNames = [] } = props;
  const { onDrag } = props;

  return (
    <motion.div {...props} {...classes("noselect", classNames)} onPan={onDrag}>
      {children}
    </motion.div>
  );
}

function BlurredWrapper(props) {
  const { children, className } = props;
  return (
    <div {...classes("full", "blurred_bkgd", className)}>
      <div {...classes("full", "focus_content", "full")}>
        <div {...classes("full")}>{children}</div>
      </div>
    </div>
  );
}

function AppSideBar(props) {
  const { children } = props;
  return (
    <SideBar>
      <BlurredWrapper {...classes("full")}>
        <div
          {...classes("full", "column", "noselect", "focus_content", "tinted")}
        >
          <div {...classes("button")}>
            <MenuIcon />
          </div>

          <div {...classes("button")}>
            <ExitToAppIcon style={{ transform: "scaleX(-1)" }} />
          </div>

          <div {...classes("button")}>
            <HomeIcon />
          </div>
          <div {...classes("button")}>
            <PeopleIcon />
          </div>
          <div {...classes("button")}>
            <ChatBubbleIcon />
          </div>
          <div {...classes("button")}>
            <BugReportIcon />
          </div>
        </div>

        {children}
      </BlurredWrapper>
    </SideBar>
  );
}

export default Home;
