import React from "react";
import { withResizeDetector } from "react-resize-detector";
import Utils from "../../../../../src/Utils";
import RelLayer from "../../../../../src/Components/Layers/RelLayer";
import AbsLayer from "../../../../../src/Components/Layers/AbsLayer";
import "./WindowContainer.scss";
const { isFunc, classes } = Utils;

const WindowContainer = withResizeDetector(function(props) {
  const { children } = props;
  const { width, height } = props;
  const { leftIndicator } = props;
  const containerSize = { width, height };

  // save these indicators for after when alternate anchor points are supported IE: se / (bottom, right)
  // const otherIndicators = (
  //   <>
  //     <div {...classes("left-indicator")}></div>
  //     <div {...classes("bottom-left-indicator")}></div>
  //   </>
  // );
  return (
    <RelLayer {...classes("full_wrapper", "full")}>
      <div {...classes("top-left-indicator")}>
        <div {...classes("indicator-inner")}>
          <div {...classes("indicator-center")}></div>
          <div {...classes("top-left-lines")}></div>
        </div>
      </div>
      <div {...classes("left-indicator", leftIndicator ? "active" : "")}></div>
      {isFunc(children) ? children({ containerSize }) : children}
    </RelLayer>
  );
});

export default WindowContainer;
