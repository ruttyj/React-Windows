import React, { useState, useEffect } from "react";
import { withResizeDetector } from "react-resize-detector";
import Utils from "../../../../Utils";
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
import FillContainer from "../../../../Components/Containers/FillContainer/FillContainer";
import FillContent from "../../../../Components/Containers/FillContainer/FillContent";
import FillHeader from "../../../../Components/Containers/FillContainer/FillHeader";
import FillFooter from "../../../../Components/Containers/FillContainer/FillFooter";
import RelLayer from "../../../../Components/Layers/RelLayer";

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

  function DragHandle(props) {
    const { children } = props;
    const { onDrag } = props;
    return (
      <motion.div {...props} onPan={onDrag}>
        {children}
      </motion.div>
    );
  }

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

export default DragWindowResizeDetector;
