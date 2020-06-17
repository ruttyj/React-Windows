import React from "react";
import Utils from "../../../Utils";
import "./style.scss";
const { getNestedValue, isDef, isArr, isStr, classes } = Utils;

function BlurredWrapper(props) {
  const { children } = props;

  // accept just about any format of classes
  let _classes = [];
  if (isDef(props.classes)) _classes.push(props.classes);
  if (isDef(props.className)) _classes.push(props.className);

  return (
    <div {...classes("full", "blurred_bkgd", _classes)}>
      <div {...classes("full", "focus_content", "full")}>
        <div {...classes("full", "center-center")}>{children}</div>
      </div>
    </div>
  );
}

export default BlurredWrapper;
