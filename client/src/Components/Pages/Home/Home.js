import React, { useState, useEffect } from "react";
import Utils from "./Utils";
import { AnimatePresence } from "framer-motion";
import AddIcon from "@material-ui/icons/Add";
import FillContainer from "../../Containers/FillContainer/FillContainer";
import FillContent from "../../Containers/FillContainer/FillContent";
import FillHeader from "../../Containers/FillContainer/FillHeader";
import FillFooter from "../../Containers/FillContainer/FillFooter";
import DragWindow from "../../../Components/Containers/Windows/DragWindow/";
import WindowContainer from "../../../Components/Containers/Windows/WindowContainer/";
import SizeBackgroundColor from "../../../Components/Containers/SizeBackgroundColor/";
import DragListV from "../../../Components/Containers/DragListV/";
import DragListH, { sample } from "../../../Components/Containers/DragListH/";
import StateBuffer from "../../../Utils/StateBuffer";
import BlurredWrapper from "../../Containers/BlurredWrapper/";
import AppSidebar from "../../../Components/TopLevel/AppSizebar/";
import AppHeader from "../../../Components/TopLevel/AppHeader/";
import update from "immutability-helper";
import "./Home.scss";

const {
  els,
  elsFn,
  isDef,
  getNestedValue,
  classes,
  setImmutableValue,
  deleteImmutableValue,
} = Utils;
let topWindowId = 0;
function MakeWindow(props) {
  const { children } = props;
  let { key, title } = props;

  let {
    isOpen = false,
    isFocused = false,
    isDragDisabled = false,
    isResizeDisabled = false,
    position = null,
    size = null,
    actions = null,
  } = props;

  if (isFocused) {
    isOpen = isFocused;
  }
  position = elsFn(position, () => ({
    left: 0,
    top: 0,
  }));
  size = elsFn(size, () => ({
    width: 700,
    height: 700,
  }));

  let id = ++topWindowId;
  key = els(key, `#${id}`);
  return {
    id,
    key,
    title: els(title, `Window #${topWindowId}`),
    isOpen,
    position,
    size,
    isFocused,
    isDragging: false,
    isResizing: false,
    isDragDisabled,
    isResizeDisabled,
    children,
    actions,
  };
}

function WindowAComponent(props) {
  const { size, position, containerSize } = props;
  let horizontalItems = {
    0: <div>item 0</div>,
    1: <div>item 1</div>,
    2: <div>item 2</div>,
  };

  let _horizontalOrder = [0, 1, 2];
  const [horizontalOrder, setHorizontalOrder] = useState(_horizontalOrder);

  return (
    <SizeBackgroundColor>
      <div {...classes("body", "grow")}>
        <div {...classes("grow")}>
          <div {...classes("column")}>
            <div {...classes("row")}>
              <div {...classes("column", "align-left")}>
                size:{" "}
                <pre style={{ padding: "100px" }}>
                  <xmp>{JSON.stringify(size, null, 2)}</xmp>
                </pre>
              </div>
              <div {...classes("column", "align-left")}>
                position:
                <pre style={{ padding: "100px" }}>
                  <xmp>{JSON.stringify(position, null, 2)}</xmp>
                </pre>
              </div>
            </div>
            <DragListH
              items={horizontalItems}
              order={horizontalOrder}
              setOrder={setHorizontalOrder}
            />
            <DragListV></DragListV>
          </div>
        </div>
      </div>
    </SizeBackgroundColor>
  );
}

const initialState = {
  windows: [
    MakeWindow({
      title: "Window A",
      isOpen: false,
      position: {
        left: 300,
        top: 50,
      },
      size: {
        width: 700,
        height: 700,
      },
      children: WindowAComponent,
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
    }),
    MakeWindow({
      title: "Trooper - IFrame",
      isOpen: false,
      isFocused: false,
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
    }),
    MakeWindow({
      id: ++topWindowId,
      title: "Debuger",
      isFocused: true,
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
    }),
  ],
};

// add additional window
const state = StateBuffer(initialState);

function Home(props) {
  const [isLeftSnapIndicator, setIsLeftSnapIndicator] = useState(false);
  const [_state, _setState] = useState(initialState);
  state.setSetter(_setState);

  const windowMethods = {};
  Object.assign(windowMethods, {
    get(id) {
      const foundIndex = state
        .get("windows", [])
        .findIndex((w) => isDef(w.id) && w.id === id);
      return state.get(["windows", foundIndex], null);
    },
    getKey(key) {
      const foundIndex = state
        .get("windows", [])
        .findIndex((w) => isDef(w.key) && w.key === key);
      return state.get(["windows", foundIndex], null);
    },
    setPosition(id, position) {
      let newValue = state.get("windows", []);
      const foundIndex = state
        .get("windows", [])
        .findIndex((w) => isDef(w.id) && w.id === id);
      if (foundIndex > -1) {
        newValue = setImmutableValue(newValue, [foundIndex, "position"], {
          ...position,
        });
        state.set("windows", newValue);
      }
    },
    setSize(id, size) {
      let newValue = state.get("windows", []);
      const foundIndex = newValue.findIndex((w) => isDef(w.id) && w.id === id);
      if (foundIndex > -1) {
        newValue = setImmutableValue(newValue, [foundIndex, "size"], {
          ...size,
        });
        state.set("windows", newValue);
      }
    },
    setState(id, newState) {
      let newValue = state.get("windows", []);
      const foundIndex = newValue.findIndex((w) => isDef(w.id) && w.id === id);
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
      return newValue;
    },
    removeWindow(id) {
      let windows = state.get("windows", []);
      const index = windows.findIndex((w) => w.id === id);
      if (index > -1) {
        state.remove(["windows", index]);
      }
      console.log(state.get());
    },
  });

  const toggleWindow = (id, forcedToggle = false) => {
    let newValue = state.get("windows", []);
    let foundIndex = newValue.findIndex((w) => w.id === id);
    if (foundIndex > -1) {
      const wasOpen = getNestedValue(newValue, [foundIndex, "isOpen"], false);
      const wasFocused = getNestedValue(
        newValue,
        [foundIndex, "isFocused"],
        false
      );
      let isOpen = !wasOpen;
      let isFocused;
      if (forcedToggle) {
        isFocused = isOpen;
      } else {
        if (!wasOpen) {
          // was not open
          isOpen = true;
          isFocused = true;
        } else {
          // was open

          // but was not focused
          if (!wasFocused) {
            isOpen = true;
            isFocused = true;
          } else {
            //open and focused
            isOpen = false;
            isFocused = false;
          }
        }
      }

      newValue = windowMethods.setFocused(id, isFocused);
      newValue = setImmutableValue(
        newValue,
        [foundIndex, "isFocused"],
        isFocused
      );
      newValue = setImmutableValue(newValue, [foundIndex, "isOpen"], isOpen);

      state.set("windows", newValue);
    }
  };

  const onSnapEnter = (window, key = "w") => {
    if (!isLeftSnapIndicator) setIsLeftSnapIndicator(true);
  };

  const onSnapLeave = (window, key = "w") => {
    if (isLeftSnapIndicator) setIsLeftSnapIndicator(false);
  };

  const addWindow = () => {
    console.log("addWindow");
    state.push(
      "windows",
      MakeWindow({
        isFocused: true,
        title: "Drag and Drop Grids - IFrame",
        children(props) {
          const { size, position } = props;
          //const {state} = props;
          //@TODO const state.set("")

          return (
            <iframe
              {...classes(["full"])}
              style={{
                "background-color": "white",
              }}
              src={`https://csb-7svhq-7wti992fk.vercel.app/`}
            />
          );
        },
      })
    );
    state.flush();
  };

  return (
    <div {...classes("full", "row", "main_bkgd")}>
      <AppSidebar>
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
                        onClose={() => windowMethods.removeWindow(window.id)}
                        onSnapEnter={onSnapEnter}
                        onSnapLeave={onSnapLeave}
                        onToggleWindow={() => toggleWindow(window.id, true)}
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
