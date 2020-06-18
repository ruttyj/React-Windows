import React, { useState, useEffect } from "react";
import { withResizeDetector } from "react-resize-detector";
import Utils from "../../../../src/Utils/";

const { classes } = Utils;

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

export default SizeBackgroundColor;
