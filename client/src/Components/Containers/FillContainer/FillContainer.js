import React from "react";
import Utils from "../../../Utils";
const { classes } = Utils;
// Children will fill space
export default ({ children, classNames = [] }) => {
  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        height: "100%",
        flexGrow: 1,
        flexDirection: "column",
      }}
      {...classes(classNames)}
    >
      {children}
    </div>
  );
};
