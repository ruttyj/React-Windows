import React from "react";

export default ({ children, height = 200, style = {} }) => {
  return (
    <div
      style={{
        flex: `1 1 ${height}px`,
        ...style
      }}
    >
      {children}
    </div>
  );
};
