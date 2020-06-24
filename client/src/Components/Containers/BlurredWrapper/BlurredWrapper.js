import React from "react";
import Utils from "../../../Utils";
import "./style.scss";
const { classes } = Utils;

function BlurredWrapper(props) {
  const { children, classNames = [] } = props;
  return (
    <div {...classes("full", "blurred-bkgd", classNames)}>
      <div {...classes("full", "focus-content", "full")}>
        <div {...classes("full")}>{children}</div>
      </div>
    </div>
  );
}

export default BlurredWrapper;
