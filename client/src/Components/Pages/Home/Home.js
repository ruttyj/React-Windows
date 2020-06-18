import React, { useState, useEffect } from "react";
import { withResizeDetector } from "react-resize-detector";
import classNames from "classname";
import Utils from "./Utils";
import SizeTaddleTail from "../../SizeTaddleTail";
import SideBar from "../../SideBar/";
import {
  motion,
  AnimatePresence,
  useTransform,
  useMotionValue,
} from "framer-motion";
import CloseIcon from "@material-ui/icons/Close";
import MinimizeIcon from "@material-ui/icons/Minimize";
import ChatBubbleIcon from "@material-ui/icons/ChatBubble";
import BugReportIcon from "@material-ui/icons/BugReport";
import PeopleIcon from "@material-ui/icons/People";
import HomeIcon from "@material-ui/icons/Home";
import MenuIcon from "@material-ui/icons/Menu";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import FlareIcon from "@material-ui/icons/Flare";
import FullscreenIcon from "@material-ui/icons/Fullscreen";
import FullscreenExitIcon from "@material-ui/icons/FullscreenExit";
import OpenWithIcon from "@material-ui/icons/OpenWith";
import FillContainer from "../../Containers/FillContainer/FillContainer";
import FillContent from "../../Containers/FillContainer/FillContent";
import FillHeader from "../../Containers/FillContainer/FillHeader";
import FillFooter from "../../Containers/FillContainer/FillFooter";
import RelLayer from "../../Layers/RelLayer";
import AbsLayer from "../../Layers/AbsLayer";
import config from "../../../config";
import DragHandle from "../../../Components/Functional/DragHandle/";
import DragWindow from "../../../Components/Containers/Windows/DragWindow/";
import WindowContainer from "../../../Components/Containers/Windows/WindowContainer/";
import StateBuffer from "../../../Utils/StateBuffer";

import "./Home.scss";
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
const initialState = {
  windows: [
    {
      id: 1,
      title: "Window A",
      isOpen: true,
      isFocused: true,
      anchor: "nw",
      position: {
        left: 600,
        top: 50,
      },
      size: {
        width: 700,
        height: 700,
      },
    },
  ],
};

const state = StateBuffer(initialState);
function Home(props) {
  const [isLeftSnapIndicator, setIsLeftSnapIndicator] = useState(false);
  const [_state, _setState] = useState(initialState);
  state.setSetter(_setState);

  const [windows, setWindows] = useState([
    {
      id: 1,
      title: "Window A",
      isOpen: true,
      isFocused: true,
      anchor: "nw",
      isDragDisabled: false,
      isFullSize: false,
      position: {
        left: 600,
        top: 50,
      },
      size: {
        width: 700,
        height: 700,
      },
    },
  ]);

  const windowMethods = {
    setPosition(id, position) {
      let newValue = state.get("windows", []);
      let foundIndex = state.get("windows", []).findIndex((w) => w.id === id);
      if (foundIndex > -1) {
        newValue = setImmutableValue(newValue, [foundIndex, "position"], {
          ...position,
        });
        state.set("windows", newValue);
      }
    },
    setSize(id, size) {
      let newValue = state.get("windows", []);
      let foundIndex = newValue.findIndex((w) => w.id === id);
      if (foundIndex > -1) {
        newValue = setImmutableValue(newValue, [foundIndex, "size"], {
          ...size,
        });
        state.set("windows", newValue);
      }
    },
    setState(id, newState) {
      let newValue = state.get("windows", []);
      let foundIndex = newValue.findIndex((w) => w.id === id);
      if (foundIndex > -1) {
        newValue = setImmutableValue(newValue, foundIndex, { ...newState });
        state.set("windows", newValue);
      }
    },
  };

  const toggleWindow = (id) => {
    let newValue = state.get("windows", []);
    let foundIndex = newValue.findIndex((w) => w.id === id);
    if (foundIndex > -1) {
      let isOpen = getNestedValue(newValue, [foundIndex, "isOpen"], false);
      newValue = setImmutableValue(newValue, [foundIndex, "isOpen"], !isOpen);
      newValue = setImmutableValue(
        newValue,
        [foundIndex, "isFocused"],
        !isOpen
      );
      state.set("windows", newValue);
    }
  };

  const onSnapEnter = (window, key = "w") => {
    if (!isLeftSnapIndicator) setIsLeftSnapIndicator(true);
  };

  const onSnapLeave = (window, key = "w") => {
    if (isLeftSnapIndicator) setIsLeftSnapIndicator(false);
  };

  return (
    <div {...classes("full", "row", "main_bkgd")}>
      <AppSideBar></AppSideBar>
      <FillContainer>
        <FillHeader>
          <AppHeader />
        </FillHeader>
        <FillContent>
          <WindowContainer
            dump={state.get("windows", [])}
            leftIndicator={isLeftSnapIndicator}
            children={({ containerSize }) => (
              <>
                {state.get("windows", []).map((window) => {
                  let contents = "";
                  if (window.isOpen) {
                    contents = (
                      <DragWindow
                        key={window.id}
                        window={window}
                        onSet={(path, value) =>
                          windowMethods.setState(
                            window.id,
                            setImmutableValue(window, path, value)
                          )
                        }
                        onSetState={(...args) =>
                          windowMethods.setState(window.id, ...args)
                        }
                        onSetSize={(...args) =>
                          windowMethods.setSize(window.id, ...args)
                        }
                        onSetPosition={(...args) => {
                          windowMethods.setPosition(window.id, ...args);
                        }}
                        onSnapEnter={onSnapEnter}
                        onSnapLeave={onSnapLeave}
                        onToggleWindow={() => toggleWindow(window.id)}
                        title={window.title}
                        containerSize={containerSize}
                      />
                    );
                  }
                  return <AnimatePresence>{contents}</AnimatePresence>;
                })}
              </>
            )}
          />
        </FillContent>
        <FillFooter height={60}>
          <div {...classes("full")}>
            <BlurredWrapper>
              <div {...classes("taskbar", "full", "tinted-dark")}>
                {state.get("windows", []).map((window) => {
                  let outterClasses = [];
                  if (window.isOpen) outterClasses.push("open");
                  if (window.isFocused) outterClasses.push("focused");

                  return (
                    <div
                      {...classes("button", "noselect", outterClasses)}
                      key={window.id}
                      onClick={() => toggleWindow(window.id)}
                    >
                      <div {...classes("truncate-inner")} key={window.id}>
                        {window.title}
                      </div>
                    </div>
                  );
                })}
              </div>
            </BlurredWrapper>
          </div>
        </FillFooter>
      </FillContainer>
    </div>
  );
}

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

function BlurredWrapper(props) {
  const { children, className } = props;
  return (
    <div {...classes("full", "blurred_bkgd", className)}>
      <div {...classes("full", "focus_content", "full")}>
        <div {...classes("full")}>{children}</div>
      </div>
    </div>
  );
}

function AppSideBar(props) {
  const { children } = props;
  return (
    <SideBar>
      <BlurredWrapper {...classes("full")}>
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

export default Home;
