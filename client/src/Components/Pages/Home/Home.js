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
import ZoomOutMapIcon from "@material-ui/icons/ZoomOutMap";
import OpenWithIcon from "@material-ui/icons/OpenWith";
import FillContainer from "../../Containers/FillContainer/FillContainer";
import FillContent from "../../Containers/FillContainer/FillContent";
import FillHeader from "../../Containers/FillContainer/FillHeader";
import FillFooter from "../../Containers/FillContainer/FillFooter";
import RelLayer from "../../Layers/RelLayer";
import config from "../../../config";

import "./Home.scss";
const { getNestedValue, isDef, isArr, isStr, classes } = Utils;

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

const AdaptiveComponent = ({ width, height, children }) => {
  const [color, setColor] = useState("red");

  useEffect(() => {
    setColor(width > 500 ? "#0099ffA0" : "#00bb00A0");
  }, [width]);

  return (
    <div
      {...classes(["column"])}
      style={{ backgroundColor: color, ...containerStyles }}
    >
      <div>{`${width}x${height}`}</div>
      <div> {children}</div>
    </div>
  );
};

const AdaptiveWithDetector = withResizeDetector(AdaptiveComponent);

function DragWindow(props) {
  const [isDragEnabled, setDragEnabled] = useState(true);
  const [isFullSize, setIsFullSize] = useState(false);
  const [position, setPosition] = useState({});
  const { width, height, wrapperSize } = props;
  const toggleDragEnabled = () => {
    console.log("toggle");
    setDragEnabled(!isDragEnabled);
  };

  const handleY = useMotionValue(0);
  const handleX = useMotionValue(0);
  const newX = useTransform(handleX, (value) => {
    return value;
  });
  const newY = useTransform(handleY, (value) => {
    return value;
  });
  if (isFullSize) {
    if (newX.get() !== 0) newX.set(0);
    if (newY.get() !== 0) newY.set(0);
  }

  const windowSize = { width, height };

  const onDrag = (e, info) => {
    if (isDragEnabled) {
      if (isFullSize) {
        setIsFullSize(false);
      }
      const posY = clamp(
        0,
        handleY.get() + info.delta.y,
        wrapperSize.height - height
      );
      const posX = clamp(
        0,
        handleX.get() + info.delta.x,
        wrapperSize.width - width
      );

      handleY.set(posY);
      handleX.set(posX);
      setPosition({
        left: posX,
        top: posY,
      });
    }
  };

  return (
    <motion.div
      style={{
        position: "absolute",
        ...(isFullSize
          ? { top: "0px", left: "0px" }
          : { top: newY, left: newX }),
        ...(isFullSize ? { height: "100%", width: "100%" } : {}),
      }}
      transition={{ type: "spring", stiffness: 200 }}
      {...classes("window", "resizable", "blurred_bkgd")}
    >
      <div {...classes("full_wrapper", "main_bkgd")}>
        <div {...classes("window-shell", "grow")}>
          <div {...classes("inner_content", "grow", "column")}>
            <FillContainer>
              <FillHeader>
                <div {...classes("header", "noselect")}>
                  <div {...classes("row")}>
                    <div {...classes("actions", "row")}>
                      <div {...classes("button", "now-allowed")}>.</div>
                      <div
                        {...classes("button")}
                        onClick={() => toggleDragEnabled()}
                      >
                        {isDragEnabled ? <OpenWithIcon /> : <CloseIcon />}
                      </div>
                    </div>
                    <DragHandle
                      onDrag={onDrag}
                      {...classes([
                        "title",
                        !isDragEnabled ? "not-allowed" : "",
                      ])}
                    >
                      Title {width}x{height}
                    </DragHandle>
                    <div {...classes("actions", "row")}>
                      <div
                        {...classes("button", "now-allowed")}
                        onClick={() => setIsFullSize(!isFullSize)}
                      >
                        <ZoomOutMapIcon />
                      </div>
                      <div {...classes("button", "now-allowed")}>
                        <CloseIcon />
                      </div>
                    </div>
                  </div>
                </div>
              </FillHeader>

              <FillContent
                classNames={["window-content", "tint-bkgd", "column"]}
              >
                <AdaptiveWithDetector>
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
                            position:
                            <pre>
                              <xmp>{JSON.stringify(position, null, 2)}</xmp>
                            </pre>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </AdaptiveWithDetector>
              </FillContent>

              <FillFooter height={60}>Footer</FillFooter>
            </FillContainer>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

const DragWindowResizeDetector = withResizeDetector(DragWindow);

function WindowArea(props) {
  const [isDragEnabled, setDragEnabled] = useState(true);
  const { width, height } = props;
  const size = { width, height };
  return (
    <RelLayer {...classes("full_wrapper", "full")}>
      <RelLayer>
        <div {...classes("top-left-indicator")}></div>
        <div {...classes("left-indicator")}></div>
        <div {...classes("bottom-left-indicator")}></div>
        <DragWindowResizeDetector wrapperSize={size} />
      </RelLayer>
    </RelLayer>
  );
}
const WindowAreaResizeDetector = withResizeDetector(WindowArea);

function Home(props) {
  return (
    <div {...classes("full", "row", "main_bkgd")}>
      <AppSideBar />
      <FillContainer>
        <FillHeader>
          <AppHeader />
        </FillHeader>
        <FillContent>
          <WindowAreaResizeDetector />
        </FillContent>
        <FillFooter>
          <div {...classes("full")}>
            <BlurredWrapper>
              <div {...classes("full", "tinted-light")}>Cart</div>
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
      style={{ width: "75px", height: "75px;", ...style }}
    >
      {children}
    </div>
  );
}

function DragHandle(props) {
  const { children } = props;
  const { onDrag } = props;
  return (
    <motion.div {...props} onPan={onDrag}>
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

function AppSideBar() {
  return (
    <SideBar>
      <BlurredWrapper {...classes("full")}>
        <div
          {...classes("full", "column", "noselect", "focus_content", "tinted")}
        >
          <div className="button">
            <MenuIcon />
          </div>

          <div className="button">
            <ExitToAppIcon style={{ transform: "scaleX(-1)" }} />
          </div>

          <div className="button">
            <HomeIcon />
          </div>
          <div className="button">
            <PeopleIcon />
          </div>
          <div className="button">
            <ChatBubbleIcon />
          </div>
          <div className="button">
            <BugReportIcon />
          </div>
        </div>
      </BlurredWrapper>
    </SideBar>
  );
}

export default Home;
