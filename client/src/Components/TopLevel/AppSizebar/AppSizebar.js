import React from "react";
import Utils from "../../../Utils/";
import SideBar from "../../../Components/SideBar/";
import ChatBubbleIcon from "@material-ui/icons/ChatBubble";
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
          <div {...classes("button", "not-allowed")}>
            <MenuIcon />
          </div>

          {children}
        </div>
      </BlurredWrapper>
    </SideBar>
  );
}

export default AppSideBar;
