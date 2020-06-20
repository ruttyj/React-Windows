import React, { useState, useEffect } from "react";
import Utils from "./Utils";
import { motion, AnimatePresence } from "framer-motion";
import AddIcon from "@material-ui/icons/Add";
import FillContainer from "../../Containers/FillContainer/FillContainer";
import FillContent from "../../Containers/FillContainer/FillContent";
import FillHeader from "../../Containers/FillContainer/FillHeader";
import FillFooter from "../../Containers/FillContainer/FillFooter";
import DragWindow from "../../../Components/Containers/Windows/DragWindow/";
import WindowContainer from "../../../Components/Containers/Windows/WindowContainer/";
import DragListH from "../../../Components/Containers/DragListH/";
import StateBuffer from "../../../Utils/StateBuffer";
import BlurredWrapper from "../../Containers/BlurredWrapper/";
import AppSidebar from "../../../Components/TopLevel/AppSizebar/";
import AppHeader from "../../../Components/TopLevel/AppHeader/";
import WindowManager from "../../../Utils/WindowManager";
import BugReportIcon from "@material-ui/icons/BugReport";
import EmojiPeopleIcon from "@material-ui/icons/EmojiPeople";
import ArrowToolTip from "../../../Components/Containers/ArrowToolTip/";
import wallpapers from "../../../Data/Wallpapers";
import PhotoSizeSelectActualIcon from "@material-ui/icons/PhotoSizeSelectActual";
import {
  createDebugger,
  createTrooperIframe,
  createWindowA,
  createWallpaperWindow
} from "./CreateWindow";
import "./Home.scss";
const {
  els,
  isDef,
  isArr,
  isFunc,
  classes,
  getNestedValue,
  setImmutableValue
} = Utils;

const state = StateBuffer({});
const windowManager = WindowManager(state);

state.set("theme", {
  wallpaper: wallpapers[7]
});

createWindowA(windowManager, false);
createWallpaperWindow(windowManager, true);
function Home(props) {
  const [isLeftSnapIndicator, setIsLeftSnapIndicator] = useState(false);
  const [_state, _setState] = useState(state.get());
  state.setSetter(_setState);

  const onSnapEnter = (window, key = "w") => {
    if (!isLeftSnapIndicator) setIsLeftSnapIndicator(true);
  };

  const onSnapLeave = (window, key = "w") => {
    if (isLeftSnapIndicator) setIsLeftSnapIndicator(false);
  };

  const addWindow = () => {
    windowManager.createWindow({
      isFocused: true,
      title: "Drag and Drop Grids - IFrame",
      children(props) {
        return (
          <iframe
            {...classes(["full"])}
            style={{
              backgroundColor: "white"
            }}
            src={`https://csb-7svhq-7wti992fk.vercel.app/`}
          />
        );
      }
    });
  };

  const openDebugger = () => {
    let window = windowManager.getWindowByKey("debugger");
    if (isDef(window)) {
      windowManager.setFocused(window.id);
    } else {
      createDebugger(windowManager);
    }
  };

  const openDancingTrooper = () => {
    let window = windowManager.getWindowByKey("trooper");
    if (isDef(window)) {
      windowManager.setFocused(window.id);
    } else {
      createTrooperIframe(windowManager);
    }
  };

  const openBackgroundPicker = () => {
    let window = windowManager.getWindowByKey("backgroundPicker");
    if (isDef(window)) {
      windowManager.setFocused(window.id);
    } else {
      createWallpaperWindow(windowManager);
    }
  };

  let taskBarItems = {};
  windowManager.getOrderedWindows().forEach(window => {
    let outterClasses = [];
    if (window.isOpen) outterClasses.push("open");
    if (window.isFocused) outterClasses.push("focused");

    taskBarItems[window.id] = (
      <ArrowToolTip title={window.title} placement="top">
        <div
          {...classes("button", "noselect", outterClasses)}
          key={window.id}
          onClick={() => windowManager.toggleWindow(window.id)}
        >
          <div {...classes("truncate-inner")} key={window.id}>
            {window.title}
          </div>
        </div>
      </ArrowToolTip>
    );
  });

  let wallpaper = state.get(["theme", "wallpaper"]);
  const style = {
    "--bkgd-image": `url("${wallpaper}")`
  };
  return (
    <motion.div {...classes("full", "row", "main_bkgd")} style={style}>
      <AppSidebar>
        <div {...classes("button")} onClick={() => openDancingTrooper()}>
          <EmojiPeopleIcon />
        </div>

        <div {...classes("button")} onClick={() => openBackgroundPicker()}>
          <PhotoSizeSelectActualIcon />
        </div>
        <div {...classes("button")} onClick={() => openDebugger()}>
          <BugReportIcon />
        </div>
        <div {...classes("button")} onClick={() => addWindow()}>
          <AddIcon />
        </div>
      </AppSidebar>
      <FillContainer>
        <FillHeader>
          <AppHeader />
        </FillHeader>
        <FillContent>
          <WindowContainer
            windowManager={windowManager}
            leftIndicator={isLeftSnapIndicator}
            children={({ containerSize }) => (
              <>
                {windowManager.getAllWindows().map(window => {
                  const contents = (
                    <DragWindow
                      window={window}
                      onSet={(path, value) =>
                        windowManager.setWindow(
                          window.id,
                          setImmutableValue(window, path, value)
                        )
                      }
                      onSetSize={(...args) =>
                        windowManager.setSize(window.id, ...args)
                      }
                      onSetPosition={(...args) => {
                        windowManager.setPosition(window.id, ...args);
                      }}
                      onClose={() => windowManager.removeWindow(window.id)}
                      onSnapEnter={onSnapEnter}
                      onSnapLeave={onSnapLeave}
                      onToggleWindow={() =>
                        windowManager.toggleWindow(window.id, true)
                      }
                      onSetFocus={value =>
                        windowManager.setFocused(window.id, value)
                      }
                      onDown={window => {
                        // allow dragging to be unaffected incase the other window prevents event propagation
                        windowManager.toggleOtherWindowsPointerEvents(
                          window.id,
                          true
                        );
                      }}
                      onUp={window => {
                        // renable pointer events for other windows
                        windowManager.toggleOtherWindowsPointerEvents(
                          window.id,
                          false
                        );
                      }}
                      title={window.title}
                      containerSize={containerSize}
                      children={window.children}
                      actions={window.actions}
                    />
                  );
                  return (
                    <AnimatePresence key={window.id}>
                      {contents}
                    </AnimatePresence>
                  );
                })}
              </>
            )}
          />
        </FillContent>
        <FillFooter height={60}>
          <div {...classes("full")}>
            <BlurredWrapper>
              <div {...classes("taskbar", "full", "tinted-dark")}>
                <DragListH
                  items={taskBarItems}
                  order={windowManager.getTaskbarOrder()}
                  setOrder={newOrder => {
                    windowManager.setTaskbarOrder(newOrder);
                  }}
                />
              </div>
            </BlurredWrapper>
          </div>
        </FillFooter>
      </FillContainer>
    </motion.div>
  );
}

export default Home;
