import React from "react";

//RelativeLayer
export default ({ children, style = {}, className = "" }) => {
  return (
    <div
      className={className}
      style={{
        display: "flex",
        position: "relative",
        width: "100%",
        height: "100%",
        ...style,
      }}
    >
      {children}
    </div>
  );
};
