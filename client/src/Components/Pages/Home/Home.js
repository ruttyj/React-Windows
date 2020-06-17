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
import config from "../../../config";

import "./Home.scss";
const { getNestedValue, isDef, isArr, isStr, classes } = Utils;

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
    setColor(width > 500 ? "#09f" : "#f90");
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

function Home(props) {
  return (
    <div {...classes("full", "row", "main_bkgd")}>
      <AppSideBar />
      <FillContainer>
        <FillHeader>
          <AppHeader />
        </FillHeader>
        <FillContent>
          <WindowArea />
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

function DragWindow(props) {
  const [isDragEnabled, setDragEnabled] = useState(true);
  const [position, setPosition] = useState({});
  const { width, height } = props;
  const toggleDragEnabled = () => {
    console.log("toggle");
    setDragEnabled(!isDragEnabled);
  };

  const { wrapperSize } = props;
  const [elementSize, setElementSize] = useState({});

  const _setElementSize = (...args) => {
    console.log("_setElementSize", ...args);
    setElementSize(...args);
  };

  const handleY = useMotionValue(0);
  const handleX = useMotionValue(0);
  let wrapperWidth = getNestedValue(wrapperSize, ["total", "width"], 0);
  let wrapperHeight = getNestedValue(wrapperSize, ["total", "height"], 0);
  let elementWidth = getNestedValue(elementSize, ["total", "width"], 0);
  let elementHeight = getNestedValue(elementSize, ["total", "height"], 0);

  const newX = useTransform(handleX, (value) => {
    return value;
  });
  const newY = useTransform(handleY, (value) => {
    return value;
  });

  const onDrag = (e, info) => {
    if (isDragEnabled) {
      const posY = handleY.get() + info.delta.y;
      const posX = handleX.get() + info.delta.x;

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
        left: newX,
        top: newY,
      }}
      transition={{ type: "spring", stiffness: 200 }}
      {...classes("window", "resizable", "blurred_bkgd")}
    >
      <SizeTaddleTail
        onChange={(e) => _setElementSize(e)}
        {...classes("full_wrapper", "main_bkgd")}
      >
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
                      <div {...classes("button", "now-allowed")}>
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
                    <div {...classes("grow", "align-left")}>
                      {isDragEnabled ? "TRUE" : "FALSE"}

                      <div {...classes("row")}>
                        <div {...classes("column")}>
                          elementSize:{" "}
                          <pre>
                            <xmp>{JSON.stringify(elementSize, null, 2)}</xmp>
                          </pre>
                        </div>
                        <div {...classes("column")}>
                          wrapperSize:{" "}
                          <pre>
                            <xmp>{JSON.stringify(wrapperSize, null, 2)}</xmp>
                          </pre>
                        </div>
                      </div>
                      <div {...classes("row")}>
                        <div {...classes("column")}></div>

                        <div {...classes("column")}>
                          position:
                          <pre>
                            <xmp>{JSON.stringify(position, null, 2)}</xmp>
                          </pre>
                        </div>
                      </div>
                    </div>
                  </div>
                </AdaptiveWithDetector>
              </FillContent>
            </FillContainer>
          </div>
        </div>
      </SizeTaddleTail>
    </motion.div>
  );
}

const DragWindowResizeDetector = withResizeDetector(DragWindow);

function WindowArea(props) {
  const [isDragEnabled, setDragEnabled] = useState(true);
  const toggleDragEnabled = () => {
    console.log("toggle");
    setDragEnabled(!isDragEnabled);
  };

  const [wrapperSize, setWrapperSize] = useState({});
  const [elementSize, setElementSize] = useState({});

  const handleY = useMotionValue(0);
  const handleX = useMotionValue(0);
  let wrapperWidth = getNestedValue(wrapperSize, ["total", "width"], 0);
  let wrapperHeight = getNestedValue(wrapperSize, ["total", "height"], 0);
  let elementWidth = getNestedValue(elementSize, ["total", "width"], 0);
  let elementHeight = getNestedValue(elementSize, ["total", "height"], 0);

  let moveConstraints = {
    top: 0,
    left: 0,
    right: wrapperWidth - elementWidth,
    bottom: wrapperHeight - elementHeight,
  };
  return (
    <SizeTaddleTail
      onChange={(e) => setWrapperSize(e)}
      {...classes("full_wrapper")}
      style={{
        position: "relative",
      }}
    >
      <DragWindowResizeDetector wrapperSize={wrapperSize} />
    </SizeTaddleTail>
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
