import React from "react";
import Utils from "../../../Utils";
const { classes } = Utils;
export default ({ children, style = {}, classNames = [] }) => {
  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        ...style,
      }}
      {...classes(classNames)}
    >
      {children}
    </div>
  );
};
