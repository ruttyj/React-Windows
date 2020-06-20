import React from "react";
import Utils from "../../../Utils";
const { classes } = Utils;
// Children will fill space
export default ({ children, classNames = [] }) => {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        display: "flex",
        flexDirection: "column"
      }}
      {...classes(classNames)}
    >
      {children}
    </div>
  );
};
