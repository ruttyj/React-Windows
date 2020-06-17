import React, { useState } from "react";
import "./SideBar.scss";
const classNames = require("classnames");
const isDef = (v) => v !== undefined && v !== null;
const isArr = (v, len = 0) => isDef(v) && Array.isArray(v) && v.length >= len;
const isStr = (v) => isDef(v) && typeof v === "string";

const SideBar = (props) => {
  const { children, className = "" } = props;
  let _className = isArr(className) ? className : [className];
  const [formData, setFormData] = useState({ name: "", description: "" });

  return (
    <div
      className={classNames(
        ..._className,
        "column",
        "sidebar-mini",
        "side-bar"
      )}
    >
      {children}
    </div>
  );
};

export default SideBar;
