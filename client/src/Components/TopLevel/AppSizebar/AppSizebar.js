import React from "react";
import Utils from "../../../Utils/";
import SideBar from "../../../Components/SideBar/";
import ChatBubbleIcon from "@material-ui/icons/ChatBubble";
import BugReportIcon from "@material-ui/icons/BugReport";
import PeopleIcon from "@material-ui/icons/People";
import HomeIcon from "@material-ui/icons/Home";
import MenuIcon from "@material-ui/icons/Menu";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import BlurredWrapper from "../../../Components/Containers/BlurredWrapper/";
const {
  els,
  getNestedValue,
  isFunc,
  isDef,
  isArr,
  isStr,
  clamp,
  classes,
  setImmutableValue,
} = Utils;

function AppSideBar(props) {
  const { children } = props;
  return (
    <SideBar>
      <BlurredWrapper classNames={"full"}>
        <div
          {...classes("full", "column", "noselect", "focus_content", "tinted")}
        >
          <div {...classes("button")}>
            <MenuIcon />
          </div>

          <div {...classes("button")}>
            <ExitToAppIcon style={{ transform: "scaleX(-1)" }} />
          </div>

          <div {...classes("button")}>
            <HomeIcon />
          </div>
          <div {...classes("button")}>
            <PeopleIcon />
          </div>
          <div {...classes("button")}>
            <ChatBubbleIcon />
          </div>
          <div {...classes("button")}>
            <BugReportIcon />
          </div>
        </div>

        {children}
      </BlurredWrapper>
    </SideBar>
  );
}

export default AppSideBar;
