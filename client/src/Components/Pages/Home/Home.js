import React, { useState, useEffect } from "react";
import Utils from "./Utils";
import { AnimatePresence } from "framer-motion";
import FillContainer from "../../Containers/FillContainer/FillContainer";
import FillContent from "../../Containers/FillContainer/FillContent";
import FillHeader from "../../Containers/FillContainer/FillHeader";
import FillFooter from "../../Containers/FillContainer/FillFooter";
import DragWindow from "../../../Components/Containers/Windows/DragWindow/";
import WindowContainer from "../../../Components/Containers/Windows/WindowContainer/";
import SizeBackgroundColor from "../../../Components/Containers/SizeBackgroundColor/";
import DragListV from "../../../Components/Containers/DragListV/";
import StateBuffer from "../../../Utils/StateBuffer";
import BlurredWrapper from "../../Containers/BlurredWrapper/";
import AppSidebar from "../../../Components/TopLevel/AppSizebar/";
import AppHeader from "../../../Components/TopLevel/AppHeader/";
import "./Home.scss";

const { isDef, getNestedValue, classes, setImmutableValue } = Utils;

let topWindowId = 0;
const initialState = {
  windows: [
    {
      id: ++topWindowId,
      title: "Window A",
      isOpen: true,
      isFocused: true,
      isDragging: false,
      isResizing: false,
      anchor: "nw",
      position: {
        left: 300,
        top: 50,
      },
      size: {
        width: 700,
        height: 700,
      },
      children: ({ size, position, containerSize }) => (
        <SizeBackgroundColor>
          <div {...classes("body", "grow")}>
            <div {...classes("grow")}>
              <div {...classes("column")}>
                <div {...classes("row", "wrap")}>
                  <div {...classes("column", "align-left")}>
                    container:{" "}
                    <pre>
                      <xmp>{JSON.stringify(containerSize, null, 2)}</xmp>
                    </pre>
                  </div>
                  <div {...classes("column", "align-left")}>
                    size:{" "}
                    <pre>
                      <xmp>{JSON.stringify(size, null, 2)}</xmp>
                    </pre>
                  </div>
                  <div {...classes("column", "align-left")}>
                    position:
                    <pre>
                      <xmp>{JSON.stringify(position, null, 2)}</xmp>
                    </pre>
                  </div>
                </div>
                <DragListV></DragListV>
              </div>
            </div>
          </div>
        </SizeBackgroundColor>
      ),
      actions: () => (
        <FillFooter
          height={40}
          classNames={["footer", "actions", "center-center"]}
        >
          <div {...classes("spacer")} />
          <div {...classes("button", "not-allowed")}>Cancel</div>
          <div {...classes("button", "not-allowed")}>Confirm</div>
        </FillFooter>
      ),
    },
    {
      id: ++topWindowId,
      title: "Trooper",
      isOpen: false,
      isFocused: false,
      isDragging: false,
      isResizing: false,
      anchor: "nw",
      position: {
        left: 1000,
        top: 50,
      },
      size: {
        width: 400,
        height: 600,
      },
      children: ({ size, position, containerSize }) => (
        <iframe
          src="https://threejs.org/examples/webgl_loader_collada_skinning.html"
          style={{ height: "100%", width: "100%" }}
        />
      ),
    },
    {
      id: ++topWindowId,
      title: "Debug",
      isOpen: true,
      isFocused: false,
      isDragging: false,
      isResizing: false,
      anchor: "nw",
      position: {
        left: 1000,
        top: 50,
      },
      size: {
        width: 400,
        height: 600,
      },
      children: ({ size, position, containerSize }) => (
        <pre {...classes("column", "align-left", "full-width")}>
          <xmp>
            state:
            {JSON.stringify(state.get(), null, 2)}
          </xmp>
        </pre>
      ),
    },
  ],
};

const state = StateBuffer(initialState);
function Home(props) {
  const [isLeftSnapIndicator, setIsLeftSnapIndicator] = useState(false);
  const [_state, _setState] = useState(initialState);
  state.setSetter(_setState);

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
    setFocused(id, value = null) {
      if (!isDef(value)) {
        value = true;
      }
      let newValue = state.get("windows", []);
      newValue.forEach((window, index) => {
        if (window.id === id) {
          newValue = setImmutableValue(newValue, [index, "isFocused"], value);
        } else {
          newValue = setImmutableValue(newValue, [index, "isFocused"], false);
        }
      });
      state.set("windows", newValue);
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
      <AppSidebar></AppSidebar>
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
                        onSetFocus={(value) =>
                          windowMethods.setFocused(window.id, value)
                        }
                        title={window.title}
                        containerSize={containerSize}
                        children={window.children}
                        actions={window.actions}
                      />
                    );
                  }
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

export default Home;
