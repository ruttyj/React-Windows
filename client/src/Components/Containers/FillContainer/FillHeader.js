import React from "react";
import Utils from "../../../Utils";
const { classes } = Utils;
export default ({ children, style = {}, classNames = [] }) => {
  return (
    <div
      style={{
        flex: "0 1 auto",
        ...style,
      }}
      {...classes(classNames)}
    >
      {children}
    </div>
  );
};
