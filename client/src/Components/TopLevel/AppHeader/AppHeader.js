import React from "react";
import Utils from "../../../Utils/";
import BlurredWrapper from "../../../Components/Containers/BlurredWrapper/";
const { classes } = Utils;

function AppHeader(props) {
  return (
    <div {...classes("app-header")}>
      <BlurredWrapper>
        <div
          {...classes(
            "full",
            "tinted-light",
            "space-between",
            "v-align-center"
          )}
        >
          <ToolbarButton>R</ToolbarButton>
          <ToolbarButton>C</ToolbarButton>
          <ToolbarButton>L</ToolbarButton>
        </div>
      </BlurredWrapper>
    </div>
  );
}

function ToolbarButton(props = {}) {
  const { classNames = [], style = {}, children } = props;
  return (
    <div
      {...classes("flex", "center-center", classNames)}
      style={{ width: "75px", height: "75px", ...style }}
    >
      {children}
    </div>
  );
}

export default AppHeader;
