import React from "react";
import { withResizeDetector } from "react-resize-detector";
import Utils from "../../../../Utils";
import RelLayer from "../../../../Components/Layers/RelLayer";
import AbsLayer from "../../../../Components/Layers/AbsLayer";
import "./WindowContainer.scss";
const { isFunc, classes } = Utils;

const WindowContainer = withResizeDetector(function(props) {
  const { children } = props;
  const { width, height } = props;
  const { windowManager } = props;
  const leftIndicator = windowManager
    .getState()
    .get(["windows", "snapIndicator", "w"], false);

  const rightIndicator = windowManager
    .getState()
    .get(["windows", "snapIndicator", "e"], false);

  const topIndicator = windowManager
    .getState()
    .get(["windows", "snapIndicator", "n"], false);

  const bottomIndicator = windowManager
    .getState()
    .get(["windows", "snapIndicator", "s"], false);
  const containerSize = { width, height };

  windowManager.setContainerSize(containerSize);

  // save these indicators for after when alternate anchor points are supported IE: se / (bottom, right)
  // const otherIndicators = (
  //   <>
  //     <div {...classes("left-indicator")}></div>
  //     <div {...classes("bottom-left-indicator")}></div>
  //   </>
  // );
  return (
    <RelLayer {...classes("full_wrapper full")}>
      <div
        {...classes(
          "corner-indicator top-left",
          topIndicator && leftIndicator ? "active" : ""
        )}
      >
        <div {...classes("indicator-inner")}>
          <div {...classes("indicator-center")} />
          <div {...classes("v-line")} />
          <div {...classes("h-line")} />
        </div>
      </div>

      <div
        {...classes(
          "corner-indicator top-right",
          topIndicator && rightIndicator ? "active" : ""
        )}
      >
        <div {...classes("indicator-inner")}>
          <div {...classes("indicator-center")} />
          <div {...classes("v-line")} />
          <div {...classes("h-line")} />
        </div>
      </div>

      <div
        {...classes(
          "corner-indicator bottom-left",
          bottomIndicator && leftIndicator ? "active" : ""
        )}
      >
        <div {...classes("indicator-inner")}>
          <div {...classes("indicator-center")} />
          <div {...classes("v-line")} />
          <div {...classes("h-line")} />
        </div>
      </div>

      <div
        {...classes(
          "corner-indicator bottom-right",
          bottomIndicator && rightIndicator ? "active" : ""
        )}
      >
        <div {...classes("indicator-inner")}>
          <div {...classes("indicator-center")} />
          <div {...classes("v-line")} />
          <div {...classes("h-line")} />
        </div>
      </div>

      <div {...classes("left-indicator", leftIndicator ? "active" : "")} />
      <div {...classes("right-indicator", rightIndicator ? "active" : "")} />
      <div {...classes("top-indicator", topIndicator ? "active" : "")} />
      <div {...classes("bottom-indicator", bottomIndicator ? "active" : "")} />
      {isFunc(children) ? children({ containerSize }) : children}
    </RelLayer>
  );
});

export default WindowContainer;
