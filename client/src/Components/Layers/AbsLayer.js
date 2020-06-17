import React from "react";

// position absolute full size
export default ({ children, style = {}, className = "" }) => {
  return (
    <div
      className={className}
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        content: "",
        ...style,
      }}
    >
      {children}
    </div>
  );
};
